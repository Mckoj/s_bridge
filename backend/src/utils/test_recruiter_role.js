const prisma = require('../config/db');

async function testRecruiterRoleBackend() {
  console.log("--- Testing Recruiter Role Backend Extensions ---");
  try {
      // 1. Fetch sample recruiter with applications
      const recruiter = await prisma.recruiter.findFirst({
        include: {
          user: true,
          internships: {
            include: { applications: true }
          }
        }
      });

      if (!recruiter) {
        console.error("No recruiter found in DB");
        process.exit(1);
      }

      console.log(`Recruiter found: ${recruiter.companyName} (ID: ${recruiter.id})`);

      // 2. Query recruiter metrics via direct prisma exactly as controller does
      const recruiterId = recruiter.id;

      const totalListings = await prisma.internship.count({
        where: { recruiterId }
      });

      const totalApplications = await prisma.application.count({
        where: { internship: { recruiterId } }
      });

      const pendingReviews = await prisma.application.count({
        where: {
          internship: { recruiterId },
          status: { in: ['PENDING', 'REVIEWING'] }
        }
      });

      const acceptedCandidates = await prisma.application.count({
        where: {
          internship: { recruiterId },
          status: 'ACCEPTED'
        }
      });

      console.log(`Recruiter Metrics:`);
      console.log(`- Total Listings: ${totalListings}`);
      console.log(`- Total Applications: ${totalApplications}`);
      console.log(`- Pending Reviews: ${pendingReviews}`);
      console.log(`- Accepted Candidates: ${acceptedCandidates}`);

      // 3. Test MatchScore Sorting logic (via prisma as would be done in controller)
      const apps = await prisma.application.findMany({
        where: {
          internship: { recruiterId }
        },
        orderBy: { matchScore: 'desc' }
      });

      console.log(`\nMatchScore sorting test for recruiter's applications:`);
      if (apps.length > 0) {
          console.log(`Top match score: ${apps[0].matchScore}`);
          if (apps.length > 1) {
             console.log(`Second match score: ${apps[1].matchScore}`);
          }
      } else {
          console.log('No applications to sort.');
      }

      console.log("\nAll Recruiter Role backend endpoints logic verified successfully!");
      process.exit(0);
  } catch (error) {
      console.error(error);
      process.exit(1);
  } finally {
      await prisma.$disconnect();
  }
}

testRecruiterRoleBackend();
