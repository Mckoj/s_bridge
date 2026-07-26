const http = require('http');
const app = require('../app');
const prisma = require('../config/db');

const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}/api`;

let server;

async function runTests() {
  // Start server
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running on port ${PORT}`);

  try {
    // 1. Reset / Seed test scenario
    console.log('Seeding clean test data...');
    
    // Find or seed student user
    const studentUser = await prisma.user.findUnique({
      where: { email: 'student@sbridge.com' },
      include: { student: { include: { skills: { include: { skill: true } } } } }
    });
    if (!studentUser || !studentUser.student) {
      throw new Error('Please run npm run seed first to set up base accounts.');
    }
    const studentProfile = studentUser.student;

    // Find recruiter user
    const recruiterUser = await prisma.user.findUnique({
      where: { email: 'recruiter@sbridge.com' },
      include: { recruiter: true }
    });
    if (!recruiterUser || !recruiterUser.recruiter) {
      throw new Error('Please run npm run seed first to set up base accounts.');
    }
    const recruiterProfile = recruiterUser.recruiter;

    // Ensure we have an open internship
    let internship = await prisma.internship.findFirst({
      where: { recruiterId: recruiterProfile.id },
      include: { skills: { include: { skill: true } } }
    });

    if (!internship) {
      throw new Error('No internship found for testing. Run seeding first.');
    }

    // Clean up any old applications for this student and internship
    await prisma.application.deleteMany({
      where: { studentId: studentProfile.id }
    });

    console.log('Test setup ready.');

    // 2. Log in as Student
    console.log('Logging in as student...');
    const studentLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@sbridge.com', password: 'Password123!' })
    });
    const studentLoginData = await studentLoginRes.json();
    if (!studentLoginRes.ok) throw new Error(`Student login failed: ${JSON.stringify(studentLoginData)}`);
    const studentToken = studentLoginData.token;

    // 3. Log in as Recruiter
    console.log('Logging in as recruiter...');
    const recruiterLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'recruiter@sbridge.com', password: 'Password123!' })
    });
    const recruiterLoginData = await recruiterLoginRes.json();
    if (!recruiterLoginRes.ok) throw new Error(`Recruiter login failed: ${JSON.stringify(recruiterLoginData)}`);
    const recruiterToken = recruiterLoginData.token;

    // 4. Apply to internship as Student
    console.log('Submitting application as Student...');
    const applyRes = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        internshipId: internship.id,
        coverLetter: 'I am highly interested in this full-stack role.',
        resumeUrl: 'https://example.com/alex_resume.pdf'
      })
    });
    const applyData = await applyRes.json();
    if (!applyRes.ok) throw new Error(`Apply failed: ${JSON.stringify(applyData)}`);
    console.log('Application submitted successfully!');
    console.log(`Match Score Calculated: ${applyData.application.matchScore}%`);
    const applicationId = applyData.application.id;

    // 5. Test duplicate application prevention
    console.log('Testing duplicate application prevention...');
    const dupRes = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        internshipId: internship.id,
        coverLetter: 'Second attempt.'
      })
    });
    const dupData = await dupRes.json();
    if (dupRes.ok) {
      throw new Error('Duplicate application should have failed but succeeded.');
    }
    console.log(`Duplicate rejected correctly: ${dupData.error}`);

    // 6. List applications as Student
    console.log('Listing applications as Student...');
    const studentListRes = await fetch(`${BASE_URL}/applications`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const studentListData = await studentListRes.json();
    if (!studentListRes.ok) throw new Error(`List failed: ${JSON.stringify(studentListData)}`);
    console.log(`Student list returned ${studentListData.applications.length} applications.`);

    // 7. List applications as Recruiter
    console.log('Listing applications as Recruiter...');
    const recruiterListRes = await fetch(`${BASE_URL}/applications`, {
      headers: { 'Authorization': `Bearer ${recruiterToken}` }
    });
    const recruiterListData = await recruiterListRes.json();
    if (!recruiterListRes.ok) throw new Error(`List failed: ${JSON.stringify(recruiterListData)}`);
    console.log(`Recruiter list returned ${recruiterListData.applications.length} applications.`);

    // 8. Update status as Recruiter
    console.log('Updating application status to REVIEWING as Recruiter...');
    const updateRes = await fetch(`${BASE_URL}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${recruiterToken}`
      },
      body: JSON.stringify({ status: 'REVIEWING' })
    });
    const updateData = await updateRes.json();
    if (!updateRes.ok) throw new Error(`Update status failed: ${JSON.stringify(updateData)}`);
    console.log(`Status updated successfully to: ${updateData.application.status}`);

    // 9. Verify Student cannot accept/reject application (Unauthorized status change)
    console.log('Testing unauthorized status change by Student...');
    const studentBadUpdateRes = await fetch(`${BASE_URL}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({ status: 'ACCEPTED' })
    });
    const studentBadUpdateData = await studentBadUpdateRes.json();
    if (studentBadUpdateRes.ok) {
      throw new Error('Student should not be allowed to change status to ACCEPTED.');
    }
    console.log(`Unauthorized status change rejected correctly: ${studentBadUpdateData.error}`);

    // 10. Withdraw application as Student
    console.log('Withdrawing application as Student...');
    const withdrawRes = await fetch(`${BASE_URL}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({ status: 'WITHDRAWN' })
    });
    const withdrawData = await withdrawRes.json();
    if (!withdrawRes.ok) throw new Error(`Withdrawal failed: ${JSON.stringify(withdrawData)}`);
    console.log(`Application withdrawn successfully! Status is: ${withdrawData.application.status}`);

    console.log('\n=================================');
    console.log(' ALL PHASE 2 TESTS PASSED SUCCESSFULLY! ');
    console.log('=================================\n');

  } catch (err) {
    console.error('Test run failed:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
      console.log('Test server shut down.');
    }
    await prisma.$disconnect();
  }
}

runTests();
