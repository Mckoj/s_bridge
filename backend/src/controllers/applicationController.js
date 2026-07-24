const prisma = require('../config/db');

async function applyToInternship(req, res) {
  try {
    const { internshipId, coverLetter, resumeUrl } = req.body;
    if (!internshipId) {
      return res.status(400).json({ error: 'Internship ID is required' });
    }

    // Get student record for authenticated user
    const student = req.user.student;
    if (!student) {
      return res.status(403).json({ error: 'Only registered students can apply for internships' });
    }

    // Check if internship exists and is open
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
      include: {
        skills: {
          include: { skill: true }
        }
      }
    });

    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    if (internship.status !== 'OPEN') {
      return res.status(400).json({ error: 'This internship listing is no longer open for applications' });
    }

    // Check duplicate application
    const existingApplication = await prisma.application.findFirst({
      where: {
        studentId: student.id,
        internshipId: internship.id
      }
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this internship' });
    }

    // Calculate skill match score
    // Student skills are preloaded on req.user.student by authenticate middleware
    const studentSkills = student.skills || [];
    const studentSkillNames = studentSkills.map(ss => ss.skill.name.toLowerCase().trim());

    // Internship required skills
    const requiredSkills = internship.skills || [];
    const requiredSkillNames = requiredSkills.map(is => is.skill.name.toLowerCase().trim());

    let matchScore = 0.0;
    if (requiredSkillNames.length > 0) {
      const matchedSkills = requiredSkillNames.filter(name => studentSkillNames.includes(name));
      matchScore = (matchedSkills.length / requiredSkillNames.length) * 100.0;
    } else {
      // If internship lists no required skills, score is 100%
      matchScore = 100.0;
    }

    // Round matchScore to two decimal places
    matchScore = Math.round(matchScore * 100) / 100;

    // Create the Application record
    const application = await prisma.application.create({
      data: {
        studentId: student.id,
        internshipId: internship.id,
        coverLetter,
        resumeUrl,
        matchScore,
        status: 'PENDING'
      },
      include: {
        internship: {
          include: {
            recruiter: {
              select: { companyName: true }
            }
          }
        }
      }
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error('Error applying to internship:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
}

async function getApplications(req, res) {
  try {
    const { role } = req.user;
    let applications = [];

    if (role === 'STUDENT') {
      const studentId = req.user.student?.id;
      if (!studentId) {
        return res.status(400).json({ error: 'Student profile not found' });
      }

      applications = await prisma.application.findMany({
        where: { studentId },
        include: {
          internship: {
            include: {
              recruiter: {
                select: { companyName: true, companyWebsite: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (role === 'RECRUITER') {
      const recruiterId = req.user.recruiter?.id;
      if (!recruiterId) {
        return res.status(400).json({ error: 'Recruiter profile not found' });
      }

      applications = await prisma.application.findMany({
        where: {
          internship: {
            recruiterId
          }
        },
        include: {
          student: {
            include: {
              skills: {
                include: { skill: true }
              },
              user: {
                select: { email: true }
              }
            }
          },
          internship: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (role === 'UNIVERSITY' || role === 'ADMIN') {
      applications = await prisma.application.findMany({
        include: {
          student: {
            include: {
              skills: {
                include: { skill: true }
              },
              user: {
                select: { email: true }
              }
            }
          },
          internship: {
            include: {
              recruiter: {
                select: { companyName: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      return res.status(403).json({ error: 'Access denied: unknown role' });
    }

    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to retrieve applications' });
  }
}

async function getApplicationById(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.user;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            skills: {
              include: { skill: true }
            },
            user: {
              select: { email: true }
            }
          }
        },
        internship: {
          include: {
            recruiter: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Role-based access validation
    if (role === 'STUDENT') {
      if (application.studentId !== req.user.student?.id) {
        return res.status(403).json({ error: 'Unauthorized to view this application' });
      }
    } else if (role === 'RECRUITER') {
      if (application.internship.recruiterId !== req.user.recruiter?.id) {
        return res.status(403).json({ error: 'Unauthorized to view applications for this internship' });
      }
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({ error: 'Failed to retrieve application details' });
  }
}

async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { role } = req.user;

    const validStatuses = ['PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid application status value' });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        internship: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Enforce role transition rules
    if (role === 'STUDENT') {
      if (application.studentId !== req.user.student?.id) {
        return res.status(403).json({ error: 'Unauthorized to modify this application' });
      }
      if (status !== 'WITHDRAWN') {
        return res.status(403).json({ error: 'Students can only withdraw applications' });
      }
    } else if (role === 'RECRUITER') {
      if (application.internship.recruiterId !== req.user.recruiter?.id) {
        return res.status(403).json({ error: 'Unauthorized to update applications for this internship' });
      }
      if (status === 'WITHDRAWN') {
        return res.status(403).json({ error: 'Recruiters cannot withdraw applications' });
      }
    } else if (role !== 'UNIVERSITY' && role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized role' });
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        internship: {
          include: {
            recruiter: {
              select: { companyName: true }
            }
          }
        }
      }
    });

    res.json({ success: true, application: updatedApplication });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
}

module.exports = {
  applyToInternship,
  getApplications,
  getApplicationById,
  updateApplicationStatus
};
