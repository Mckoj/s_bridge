const prisma = require('../config/db');
require('dotenv').config({ path: '../../.env' });
const authService = require('../services/authServices');
const { getReports, getReportById } = require('../controllers/reportController');
const { getAllStudents, getStudentById } = require('../controllers/studentController');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 's_bridge_super_secret_jwt_key_change_in_production';

function mockReqRes(body = {}, params = {}, query = {}, user = null) {
  const result = { status: null, data: null };
  const req = { body, params, query, user };
  const res = {
    status(code) { result.status = code; return res; },
    json(data) {
      if (!result.status) result.status = 200;
      result.data = data;
      return res;
    }
  };
  return { req, res, getResult: () => result };
}

async function runTenantSecurityTestSuite() {
  console.log('===========================================================');
  console.log('   STRICT UNIVERSITY MULTI-TENANT SECURITY TEST SUITE    ');
  console.log('===========================================================\n');

  let passed = 0;
  let failed = 0;

  try {
    // Fetch KNUST and UG universities from DB (seeded or created)
    let knustUni = await prisma.university.findUnique({ where: { domain: 'knust.edu.gh' } });
    let ugUni = await prisma.university.findUnique({ where: { domain: 'ug.edu.gh' } });

    if (!knustUni) {
      knustUni = await prisma.university.create({
        data: { universityName: 'KNUST', domain: 'knust.edu.gh', isVerified: true }
      });
    }
    if (!ugUni) {
      ugUni = await prisma.university.create({
        data: { universityName: 'UG', domain: 'ug.edu.gh', isVerified: true }
      });
    }

    // -------------------------------------------------------------
    // Test 1: Normal access — KNUST user sees KNUST students only
    // -------------------------------------------------------------
    console.log('Test 1: Normal Access (KNUST user fetches students)');
    const knustUser = await prisma.user.findFirst({
      where: { role: 'UNIVERSITY', universityId: knustUni.id }
    }) || await prisma.user.create({
      data: {
        email: `admin_${Date.now()}@knust.edu.gh`,
        passwordHash: 'hashedpass',
        role: 'UNIVERSITY',
        isVerified: true,
        universityId: knustUni.id
      }
    });

    const { req: req1, res: res1, getResult: getRes1 } = mockReqRes({}, {}, {}, knustUser);
    await getAllStudents(req1, res1);
    const res1Data = getRes1();

    if (res1Data.status === 200 && Array.isArray(res1Data.data.students)) {
      const nonKnustStudents = res1Data.data.students.filter(s => s.universityId && s.universityId !== knustUni.id);
      if (nonKnustStudents.length === 0) {
        console.log('   ✅ PASS: KNUST user receives only KNUST students.');
        passed++;
      } else {
        console.log(`   ❌ FAIL: KNUST user received students from other universities (${nonKnustStudents.length} leaked).`);
        failed++;
      }
    } else {
      console.log('   ❌ FAIL: Status was not 200');
      failed++;
    }

    // -------------------------------------------------------------
    // Test 2: Cross-university report isolation — KNUST user attempts GET UG report
    // -------------------------------------------------------------
    console.log('\nTest 2: Cross-Tenant Report Access (KNUST user attempts to view UG report)');
    
    // Create UG Student & UG Report
    const ugStudentUser = await prisma.user.create({
      data: {
        email: `ug_student_${Date.now()}@ug.edu.gh`,
        passwordHash: 'pass',
        role: 'STUDENT',
        isVerified: true,
        universityId: ugUni.id,
        student: {
          create: {
            firstName: 'UG',
            lastName: 'Student',
            universityId: ugUni.id
          }
        }
      },
      include: { student: true }
    });

    const recruiterUser = await prisma.user.findFirst({ where: { role: 'RECRUITER' } }) || await prisma.user.create({
      data: {
        email: `rec_${Date.now()}@test.com`,
        passwordHash: 'pass',
        role: 'RECRUITER',
        isVerified: true,
        recruiter: { create: { companyName: 'Test Corp' } }
      },
      include: { recruiter: true }
    });

    const internship = await prisma.internship.findFirst() || await prisma.internship.create({
      data: {
        recruiterId: recruiterUser.recruiter.id,
        title: 'Test Role',
        description: 'Test',
        location: 'Remote',
        internshipType: 'REMOTE',
        duration: '3 Months'
      }
    });

    const ugReport = await prisma.report.create({
      data: {
        studentId: ugStudentUser.student.id,
        internshipId: internship.id,
        title: 'UG Confidential Logbook',
        fileUrl: 'http://example.com/ug_logbook.pdf'
      }
    });

    // Request UG report using KNUST user context
    const { req: req2, res: res2, getResult: getRes2 } = mockReqRes({}, { id: ugReport.id }, {}, knustUser);
    await getReportById(req2, res2);
    const res2Data = getRes2();

    if (res2Data.status === 404 || res2Data.status === 403) {
      console.log(`   ✅ PASS: KNUST user cannot view UG report (Received status ${res2Data.status}).`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Cross-tenant data leak! Status was ${res2Data.status}`);
      failed++;
    }

    // -------------------------------------------------------------
    // Test 3: Forged University ID in Request Body
    // -------------------------------------------------------------
    console.log('\nTest 3: Forged University ID in Request Body');
    const { req: req3, res: res3, getResult: getRes3 } = mockReqRes(
      { universityId: ugUni.id }, // Attempting to forge UG universityId in body
      {},
      {},
      knustUser
    );
    await getReports(req3, res3);
    const res3Data = getRes3();

    if (res3Data.status === 200 && Array.isArray(res3Data.data.reports)) {
      const leakedUgReports = res3Data.data.reports.filter(r => r.student?.universityId === ugUni.id);
      if (leakedUgReports.length === 0) {
        console.log('   ✅ PASS: Forged body universityId was ignored, query stayed in KNUST context.');
        passed++;
      } else {
        console.log('   ❌ FAIL: Body universityId override allowed cross-tenant query execution.');
        failed++;
      }
    } else {
      console.log(`   ❌ FAIL: getReports failed with status ${res3Data.status}`);
      failed++;
    }

    // -------------------------------------------------------------
    // Test 4: Forged JWT Token
    // -------------------------------------------------------------
    console.log('\nTest 4: Forged JWT Token Verification');
    const forgedToken = jwt.sign(
      { id: knustUser.id, role: 'UNIVERSITY', universityId: ugUni.id },
      'WRONG_SIGNING_SECRET'
    );

    try {
      jwt.verify(forgedToken, JWT_SECRET);
      console.log('   ❌ FAIL: Forged JWT was unexpectedly accepted!');
      failed++;
    } catch (jwtErr) {
      console.log('   ✅ PASS: Forged JWT signature rejected successfully.');
      passed++;
    }

    // -------------------------------------------------------------
    // Test 5: Unapproved Domain Registration
    // -------------------------------------------------------------
    console.log('\nTest 5: Unapproved Domain Registration Prevention');
    try {
      await authService.register(
        `attacker_${Date.now()}@gmail.com`,
        'Password123!',
        'UNIVERSITY',
        {}
      );
      console.log('   ❌ FAIL: Registration allowed for unapproved domain @gmail.com!');
      failed++;
    } catch (regErr) {
      if (regErr.message.includes('Invalid institutional domain') || regErr.message.includes('not currently approved')) {
        console.log(`   ✅ PASS: Registration rejected for unapproved domain (${regErr.message}).`);
        passed++;
      } else {
        console.log(`   ❌ FAIL: Unexpected error message: ${regErr.message}`);
        failed++;
      }
    }

    // Cleanup created test artifacts
    await prisma.report.delete({ where: { id: ugReport.id } }).catch(() => {});
    await prisma.user.delete({ where: { id: ugStudentUser.id } }).catch(() => {});

  } catch (err) {
    console.error('\n❌ Suite Error:', err);
    failed++;
  } finally {
    console.log('\n===========================================================');
    console.log(`   RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('===========================================================\n');
    await prisma.$disconnect();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTenantSecurityTestSuite();
