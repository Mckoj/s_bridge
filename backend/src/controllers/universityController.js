const prisma = require('../config/db');

/**
 * Fetch aggregated statistics for the University Dashboard
 * Accessible only by UNIVERSITY and ADMIN roles
 */
async function getUniversityStats(req, res) {
  try {
    const universityId = req.user.university?.id;
    const studentWhere = universityId ? { universityId } : {};

    const totalStudents = await prisma.student.count({ where: studentWhere });
    const totalRecruiters = await prisma.recruiter.count();
    const totalInternships = await prisma.internship.count({
      where: { status: 'OPEN' }
    });
    
    const pendingRecruiters = await prisma.recruiter.count({
      where: { isApproved: false }
    });

    const totalApplications = await prisma.application.count({
      where: universityId ? { student: { universityId } } : {}
    });

    const activePlacements = await prisma.application.count({
      where: {
        status: 'ACCEPTED',
        ...(universityId ? { student: { universityId } } : {})
      }
    });

    const pending = await prisma.application.count({
      where: {
        status: { in: ['PENDING', 'REVIEWING'] },
        ...(universityId ? { student: { universityId } } : {})
      }
    });

    const rejected = await prisma.application.count({
      where: {
        status: 'REJECTED',
        ...(universityId ? { student: { universityId } } : {})
      }
    });

    const placementRate = totalStudents > 0 
      ? Math.round((activePlacements / totalStudents) * 1000) / 10 
      : 0;

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalRecruiters,
        pendingRecruiters,
        totalInternships,
        totalApplications,
        activePlacements,
        studentsPlaced: activePlacements,
        placementRate,
        pending,
        rejected
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

async function createAnnouncement(req, res) {
  try {
    const university = req.user.university;
    if (!university && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only university liaisons can publish announcements' });
    }

    const { title, content, targetGroup, targetAudience } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    let uniId = university?.id;
    if (!uniId && req.user.role === 'ADMIN') {
      const firstUni = await prisma.university.findFirst();
      uniId = firstUni?.id;
    }

    if (!uniId) {
      return res.status(400).json({ error: 'University record not found for announcement' });
    }

    const announcement = await prisma.announcement.create({
      data: {
        universityId: uniId,
        title,
        content,
        targetAudience: targetAudience || targetGroup || 'ALL'
      }
    });

    const formatted = {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      targetGroup: announcement.targetAudience,
      targetAudience: announcement.targetAudience,
      status: 'PUBLISHED',
      publishedAt: announcement.createdAt.toISOString()
    };

    res.status(201).json({ success: true, announcement: formatted });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to publish announcement' });
  }
}

async function getUniversityAnnouncements(req, res) {
  try {
    const universityId = req.user.university?.id;

    const announcements = await prisma.announcement.findMany({
      where: universityId ? { universityId } : {},
      orderBy: { createdAt: 'desc' }
    });

    const formatted = announcements.map(a => ({
      id: a.id,
      title: a.title,
      content: a.content,
      targetGroup: a.targetAudience,
      targetAudience: a.targetAudience,
      status: 'PUBLISHED',
      publishedAt: a.createdAt.toISOString()
    }));

    res.json({ success: true, announcements: formatted });
  } catch (error) {
    console.error('Error fetching university announcements:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
}

module.exports = {
  getUniversityStats,
  approveRecruiter,
  createAnnouncement,
  getUniversityAnnouncements
};

