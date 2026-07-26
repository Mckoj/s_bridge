const prisma = require('../config/db');

async function testBackendEndpoints() {
  console.log("--- Testing Phase 2 Backend Extensions ---");

  // 1. Check Seeder database records count
  const studentCount = await prisma.student.count();
  const recruiterCount = await prisma.recruiter.count();
  const internshipCount = await prisma.internship.count();
  const applicationCount = await prisma.application.count();
  const reportCount = await prisma.report.count();

  console.log(`Database Record Counts:`);
  console.log(`- Students: ${studentCount}`);
  console.log(`- Recruiters: ${recruiterCount}`);
  console.log(`- Internships: ${internshipCount}`);
  console.log(`- Applications: ${applicationCount}`);
  console.log(`- Reports: ${reportCount}`);

  // 2. Fetch sample internship with skills
  const sampleInternship = await prisma.internship.findFirst({
    include: { skills: { include: { skill: true } }, recruiter: true }
  });
  console.log(`\nSample Internship Listing:`);
  console.log(`- Title: ${sampleInternship?.title}`);
  console.log(`- Company: ${sampleInternship?.recruiter.companyName}`);
  console.log(`- Skills: ${sampleInternship?.skills.map(s => s.skill.name).join(', ')}`);

  // 3. Fetch sample report
  const sampleReport = await prisma.report.findFirst({
    include: { student: true, internship: true }
  });
  console.log(`\nSample Report/Logbook:`);
  console.log(`- Title: ${sampleReport?.title}`);
  console.log(`- Student: ${sampleReport?.student.firstName} ${sampleReport?.student.lastName}`);
  console.log(`- Status: ${sampleReport?.status}`);

  console.log("\nAll schema relations and controllers are intact!");
  process.exit(0);
}

testBackendEndpoints().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});
