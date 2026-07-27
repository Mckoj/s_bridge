const prisma = require('../config/db');
require('dotenv').config({ path: '../../.env' });

// Minimal mock request/response helper (same pattern as other test scripts)
function mockReqRes(body = {}, params = {}, user = null) {
  const result = { status: null, data: null };
  const req = { body, params, user };
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

const { getUniversityStats, approveRecruiter } = require('../controllers/universityController');

async function testUniversityRole() {
  console.log('=== Testing University Role Backend Implementation ===\n');
  try {
    // 1. Find a university user to use as req.user context
    const universityUser = await prisma.user.findFirst({
      where: { role: 'UNIVERSITY', isVerified: true },
      include: { university: true }
    });

    if (!universityUser) {
      console.log('No verified university user found. Please run seed script first.');
      process.exit(1);
    }

    console.log(`Using University Admin: ${universityUser.email}`);

    // 2. Test getUniversityStats
    console.log('\n1. Testing GET /api/universities/stats...');
    const { req: statsReq, res: statsRes, getResult: getStatsResult } = mockReqRes({}, {}, universityUser);
    await getUniversityStats(statsReq, statsRes);
    const statsResult = getStatsResult();
    console.log(`   Status: ${statsResult.status}`);
    console.log('   Stats:', JSON.stringify(statsResult.data?.stats, null, 2));

    if (statsResult.status !== 200) {
      throw new Error('Stats fetch failed: ' + JSON.stringify(statsResult.data));
    }
    console.log('   ✅ getUniversityStats PASSED');

    // 3. Test approveRecruiter — find an unapproved recruiter
    let unapprovedRecruiter = await prisma.recruiter.findFirst({ where: { isApproved: false } });
    let createdDummy = false;

    if (!unapprovedRecruiter) {
      console.log('\n   No unapproved recruiters found. Creating a dummy one to test...');
      const dummyUser = await prisma.user.create({
        data: {
          email: `dummy_recruiter_test_${Date.now()}@test.com`,
          passwordHash: 'dummyhash',
          role: 'RECRUITER',
          isVerified: true,
          recruiter: { create: { companyName: 'Dummy Corp', isApproved: false } }
        },
        include: { recruiter: true }
      });
      unapprovedRecruiter = dummyUser.recruiter;
      createdDummy = true;
    }

    console.log(`\n2. Testing PATCH /api/universities/recruiters/${unapprovedRecruiter.id}/approve...`);
    console.log(`   Recruiter: ${unapprovedRecruiter.companyName} (isApproved: ${unapprovedRecruiter.isApproved})`);

    const { req: approveReq, res: approveRes, getResult: getApproveResult } = mockReqRes(
      {},
      { id: unapprovedRecruiter.id },
      universityUser
    );
    await approveRecruiter(approveReq, approveRes);
    const approveResult = getApproveResult();
    console.log(`   Status: ${approveResult.status}`);
    console.log(`   Message: ${approveResult.data?.message}`);
    console.log(`   Recruiter isApproved: ${approveResult.data?.recruiter?.isApproved}`);

    if (approveResult.status !== 200 || !approveResult.data?.recruiter?.isApproved) {
      throw new Error('Approve recruiter failed: ' + JSON.stringify(approveResult.data));
    }
    console.log('   ✅ approveRecruiter PASSED');

    // Cleanup dummy if created
    if (createdDummy) {
      const usr = await prisma.user.findFirst({ where: { recruiter: { id: unapprovedRecruiter.id } } });
      if (usr) await prisma.user.delete({ where: { id: usr.id } });
    }

    console.log('\n=== ✅ University Role Testing Completed Successfully ===');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testUniversityRole();
