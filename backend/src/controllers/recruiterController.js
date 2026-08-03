const prisma = require('../config/db');
const { uploadToCloudinary } = require('../utils/cloudinary');

async function getAllRecruiters(req, res) {
  try {
    const recruiters = await prisma.recruiter.findMany({
      include: {
        companyProfile: true,
        user: {
          select: { email: true, isVerified: true }
        }
      }
    });
    res.json({ success: true, recruiters });
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

module.exports = {
  getAllRecruiters,
  getRecruiterById,
  getCurrentRecruiterProfile,
  updateRecruiter,
  getRecruiterStats,
  uploadLogo
};
