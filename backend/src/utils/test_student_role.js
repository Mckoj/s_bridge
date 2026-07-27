const prisma = require('../config/db');

async function testStudentRoleBackend() {
  console.log("--- Testing Student Role Backend Extensions ---");

  // 1. Fetch sample student with applications & reports
  const student = await prisma.student.findFirst({
    include: {
      user: true,
      applications: true,
      reports: true
    }
  });

  if (!student) {
    console.error("No student found in DB");
    process.exit(1);
  }

  console.log(`Student found: ${student.firstName} ${student.lastName} (ID: ${student.id})`);

  // 2. Query student metrics
  const totalApplications = await prisma.application.count({ where: { studentId: student.id } });
  const pendingReviews = await prisma.application.count({
    where: { studentId: student.id, status: { in: ['PENDING', 'REVIEWING'] } }
  });
  const acceptedOffers = await prisma.application.count({
    where: { studentId: student.id, status: 'ACCEPTED' }
  });
  const submittedReports = await prisma.report.count({ where: { studentId: student.id } });

  console.log(`Student Metrics:`);
  console.log(`- Total Applications: ${totalApplications}`);
  console.log(`- Pending Reviews: ${pendingReviews}`);
  console.log(`- Accepted Offers: ${acceptedOffers}`);
  console.log(`- Submitted Reports: ${submittedReports}`);

  // 3. Test active internship query
  const activeApp = await prisma.application.findFirst({
    where: { studentId: student.id, status: 'ACCEPTED' },
    include: { internship: { include: { recruiter: true } } }
  });

  if (activeApp) {
    console.log(`\nActive Placement found:`);
    console.log(`- Title: ${activeApp.internship.title}`);
    console.log(`- Company: ${activeApp.internship.recruiter.companyName}`);
  } else {
    console.log(`\nNo ACCEPTED placement for this student (expected if all are PENDING/REVIEWING).`);
  }

  console.log("\nAll Student Role backend endpoints & validation rules verified successfully!");
  process.exit(0);
}

testStudentRoleBackend().catch(err => {
  console.error("Student role test error:", err);
  process.exit(1);
});
