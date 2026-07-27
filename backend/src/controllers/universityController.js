const prisma = require('../config/db');

/**
 * Fetch aggregated statistics for the University Dashboard
 * Accessible only by UNIVERSITY and ADMIN roles
 */
async function getUniversityStats(req, res) {
  try {
    // Basic aggregated counts across the entire system
    const totalStudents = await prisma.student.count();
    const totalRecruiters = await prisma.recruiter.count();
    const totalInternships = await prisma.internship.count({
      where: { status: 'OPEN' }
    });
    
    const pendingRecruiters = await prisma.recruiter.count({
      where: { isApproved: false }
    });

    const totalApplications = await prisma.application.count();

    const activePlacements = await prisma.application.count({
      where: { status: 'ACCEPTED' }
    });

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalRecruiters,
        pendingRecruiters,
        totalInternships,
        totalApplications,
        activePlacements
      }
    });
  } catch (error) {
    console.error('Error fetching university stats:', error);
    res.status(500).json({ error: 'Failed to fetch university statistics' });
  }
}

/**
 * Approve a recruiter to allow them to post internships
 * Accessible only by UNIVERSITY and ADMIN roles
 */
async function approveRecruiter(req, res) {
  try {
    const { id } = req.params;
    
    // Check if the recruiter exists
    const recruiter = await prisma.recruiter.findUnique({
      where: { id }
    });

    if (!recruiter) {
      return res.status(404).json({ error: 'Recruiter not found' });
    }

    const updatedRecruiter = await prisma.recruiter.update({
      where: { id },
      data: { isApproved: true },
      include: {
        companyProfile: true
      }
    });

    res.json({
      success: true,
      message: 'Recruiter approved successfully',
      recruiter: updatedRecruiter
    });
  } catch (error) {
    console.error('Error approving recruiter:', error);
    res.status(500).json({ error: 'Failed to approve recruiter' });
  }
}

module.exports = {
  getUniversityStats,
  approveRecruiter
};
