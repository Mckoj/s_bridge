const prisma = require('../config/db');
const { uploadToCloudinary } = require('../utils/cloudinary');

async function getAllRecruiters(req, res) {
  try {
    const { page, limit, search, status } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    let whereClause = {};

    if (status === 'pending') {
      whereClause.isApproved = false;
    } else if (status === 'approved') {
      whereClause.isApproved = true;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = search.trim();
      whereClause.OR = [
        { companyName: { contains: term, mode: 'insensitive' } },
        { position: { contains: term, mode: 'insensitive' } },
        { companyWebsite: { contains: term, mode: 'insensitive' } },
        { user: { email: { contains: term, mode: 'insensitive' } } }
      ];
    }

    const [total, recruiters] = await Promise.all([
      prisma.recruiter.count({ where: whereClause }),
      prisma.recruiter.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          companyProfile: true,
          user: {
            select: { email: true, isVerified: true }
          }
        }
      })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      recruiters,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching recruiters:', error);
    res.status(500).json({ error: 'Failed to fetch recruiters list' });
  }
}

async function getRecruiterById(req, res) {
  try {
    const { id } = req.params;
    const recruiter = await prisma.recruiter.findUnique({
      where: { id },
      include: {
        companyProfile: true,
        user: {
          select: { email: true }
        },
        internships: true
      }
    });

    if (!recruiter) {
      return res.status(404).json({ error: 'Recruiter not found' });
    }

    res.json({ success: true, recruiter });
  } catch (error) {
    console.error('Error fetching recruiter details:', error);
    res.status(500).json({ error: 'Failed to fetch recruiter details' });
  }
}

/**
 * GET /api/recruiters/me
 * Returns the authenticated recruiter's own profile + company details.
 * Uses the recruiter relation already loaded by the auth middleware,
 * so no raw ID is needed from the frontend.
 */
async function getCurrentRecruiterProfile(req, res) {
  try {
    const recruiter = req.user.recruiter;
    if (!recruiter) {
      return res.status(403).json({ error: 'Only registered recruiters can access this endpoint' });
    }

    const profile = await prisma.recruiter.findUnique({
      where: { id: recruiter.id },
      include: {
        companyProfile: true,
        user: {
          select: { email: true }
        },
        internships: true
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Recruiter profile not found' });
    }

    res.json({ success: true, recruiter: profile });
  } catch (error) {
    console.error('Error fetching current recruiter profile:', error);
    res.status(500).json({ error: 'Failed to fetch recruiter profile' });
  }
}

async function updateRecruiter(req, res) {
  try {
    const { id } = req.params;
    const { companyName, companyWebsite, position, description, logoUrl, industry, size, address, website } = req.body;

    const recruiter = await prisma.recruiter.findUnique({ where: { id } });
    if (!recruiter) {
      return res.status(404).json({ error: 'Recruiter profile not found' });
    }

    if (req.user.role !== 'ADMIN' && req.user.recruiter?.id !== recruiter.id) {
      return res.status(403).json({ error: 'Unauthorized to edit this profile' });
    }

    const updatedRecruiter = await prisma.$transaction(async (tx) => {
      await tx.recruiter.update({
        where: { id },
        data: {
          companyName,
          companyWebsite,
          position
        }
      });

      await tx.companyProfile.upsert({
        where: { recruiterId: id },
        create: {
          recruiterId: id,
          description,
          logoUrl,
          industry,
          size,
          address,
          website: website || companyWebsite
        },
        update: {
          description,
          logoUrl,
          industry,
          size,
          address,
          website
        }
      });

      return tx.recruiter.findUnique({
        where: { id },
        include: { companyProfile: true }
      });
    });

    res.json({ success: true, recruiter: updatedRecruiter });
  } catch (error) {
    console.error('Error updating recruiter profile:', error);
    res.status(500).json({ error: 'Failed to update recruiter details' });
  }
}

async function getRecruiterStats(req, res) {
  try {
    const recruiter = req.user.recruiter;
    if (!recruiter) {
      return res.status(403).json({ error: 'Only registered recruiters can view stats' });
    }

    const recruiterId = recruiter.id;

    // Run all count queries in parallel for better performance
    const [totalListings, totalApplications, pendingReviews, acceptedCandidates] = await Promise.all([
      prisma.internship.count({
        where: { recruiterId }
      }),
      prisma.application.count({
        where: { internship: { recruiterId } }
      }),
      prisma.application.count({
        where: {
          internship: { recruiterId },
          status: { in: ['PENDING', 'REVIEWING'] }
        }
      }),
      prisma.application.count({
        where: {
          internship: { recruiterId },
          status: 'ACCEPTED'
        }
      })
    ]);

    res.json({
      success: true,
      stats: {
        totalListings,
        totalApplications,
        pendingReviews,
        acceptedCandidates
      }
    });
  } catch (error) {
    console.error('Error fetching recruiter stats:', error);
    res.status(500).json({ error: 'Failed to fetch recruiter statistics' });
  }
}

async function uploadLogo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please attach an image file.' });
    }

    const recruiter = req.user.recruiter;
    if (!recruiter) {
      return res.status(403).json({ error: 'Only recruiters can upload a company logo' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'logos', 'image');

    await prisma.companyProfile.upsert({
      where: { recruiterId: recruiter.id },
      create: { recruiterId: recruiter.id, logoUrl: result.url },
      update: { logoUrl: result.url }
    });

    res.json({ success: true, message: 'Company logo uploaded successfully', logoUrl: result.url });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: error.message || 'Failed to upload company logo' });
  }
}

async function getRecruiterAnalytics(req, res) {
  try {
    const recruiter = req.user.recruiter;
    if (!recruiter) {
      return res.status(403).json({ error: 'Only registered recruiters can view analytics' });
    }

    const recruiterId = recruiter.id;

    // Fetch internship listings with applications and required skills
    const internships = await prisma.internship.findMany({
      where: { recruiterId },
      include: {
        skills: {
          include: { skill: true }
        },
        applications: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            interviews: { select: { id: true } }
          }
        }
      }
    });

    const totalListings = internships.length;
    const activeListings = internships.filter(i => i.status === 'OPEN').length;

    let totalApplications = 0;
    let pendingCount = 0;
    let reviewingCount = 0;
    let acceptedCount = 0;
    let rejectedCount = 0;
    let withdrawnCount = 0;
    let totalInterviewsScheduled = 0;

    const skillCounts = {};

    const listingsPerformance = internships.map(item => {
      const appCount = item.applications.length;
      const accepted = item.applications.filter(a => a.status === 'ACCEPTED').length;
      
      totalApplications += appCount;

      item.applications.forEach(app => {
        if (app.status === 'PENDING') pendingCount++;
        else if (app.status === 'REVIEWING') reviewingCount++;
        else if (app.status === 'ACCEPTED') acceptedCount++;
        else if (app.status === 'REJECTED') rejectedCount++;
        else if (app.status === 'WITHDRAWN') withdrawnCount++;

        if (app.interviews && app.interviews.length > 0) {
          totalInterviewsScheduled += app.interviews.length;
        }
      });

      item.skills.forEach(s => {
        const name = s.skill.name;
        skillCounts[name] = (skillCounts[name] || 0) + 1;
      });

      return {
        id: item.id,
        title: item.title,
        status: item.status,
        location: item.location,
        applicationsCount: appCount,
        acceptedCount: accepted
      };
    });

    const topSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const conversionRate = totalApplications > 0 
      ? Number(((acceptedCount / totalApplications) * 100).toFixed(1)) 
      : 0;

    res.json({
      success: true,
      analytics: {
        totalListings,
        activeListings,
        totalApplications,
        interviewsScheduled: totalInterviewsScheduled,
        conversionRate,
        funnel: {
          applied: totalApplications,
          pending: pendingCount,
          underReview: reviewingCount,
          interviewing: totalInterviewsScheduled,
          accepted: acceptedCount,
          rejected: rejectedCount,
          withdrawn: withdrawnCount
        },
        topSkills,
        listingsPerformance
      }
    });
  } catch (error) {
    console.error('Error fetching recruiter analytics:', error);
    res.status(500).json({ error: 'Failed to fetch recruiter analytics' });
  }
}

module.exports = {
  getAllRecruiters,
  getRecruiterById,
  getCurrentRecruiterProfile,
  updateRecruiter,
  getRecruiterStats,
  getRecruiterAnalytics,
  uploadLogo
};

