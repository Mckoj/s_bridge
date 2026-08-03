const prisma = require('../config/db');

async function applyToInternship(req, res) {
  try {
    const { internshipId, coverLetter, resumeUrl } = req.body;
    if (!internshipId) {
      return res.status(400).json({ error: 'Internship ID is required' });
    }

    if (resumeUrl && typeof resumeUrl === 'string' && resumeUrl.trim().length > 0) {
      const urlRegex = /^(https?:\/\/[^\s]+)$/i;
      if (!urlRegex.test(resumeUrl.trim())) {
        return res.status(400).json({ error: 'Resume URL must be a valid URL starting with http:// or https://' });
      }
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

      const sortBy = req.query.sortBy;
      let orderBy = { createdAt: 'desc' };
      if (sortBy === 'matchScore') {
        orderBy = { matchScore: 'desc' };
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
        orderBy
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
    } else if (role !== 'UNIVERSITY' && role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized role' });
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({ error: 'Failed to retrieve application details' });
  }
}

async function scheduleInterview(req, res) {
  try {
    const { applicationId, scheduledAt, duration, platform, meetingLink, interviewer, notes } = req.body;
    const targetAppId = req.params.id || applicationId;

    if (!targetAppId || !scheduledAt || !meetingLink || !interviewer) {
      return res.status(400).json({ error: 'applicationId, scheduledAt, meetingLink, and interviewer are required' });
    }

    const application = await prisma.application.findUnique({
      where: { id: targetAppId },
      include: { internship: true }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { role } = req.user;
    if (role === 'RECRUITER') {
      if (application.internship.recruiterId !== req.user.recruiter?.id) {
        return res.status(403).json({ error: 'Unauthorized to schedule interviews for this internship' });
      }
      if (!req.user.recruiter?.isApproved) {
        return res.status(403).json({ error: 'Your recruiter account is pending approval. You cannot schedule interviews until approved.' });
      }
    } else if (role !== 'UNIVERSITY' && role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized to schedule interviews' });
    }

    const interview = await prisma.interview.create({
      data: {
        applicationId: targetAppId,
        scheduledAt: new Date(scheduledAt),
        duration: duration || '30 Mins',
        platform: platform || 'Google Meet',
        meetingLink,
        interviewer,
        notes
      }
    });

    res.status(201).json({ success: true, interview });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    res.status(500).json({ error: 'Failed to schedule interview' });
  }
}

async function getInterviews(req, res) {
  try {
    const { role } = req.user;
    let whereClause = {};

    if (role === 'STUDENT') {
      const studentId = req.user.student?.id;
      if (!studentId) {
        return res.status(400).json({ error: 'Student profile not found' });
      }
      whereClause = { application: { studentId } };
    } else if (role === 'RECRUITER') {
      const recruiterId = req.user.recruiter?.id;
      if (!recruiterId) {
        return res.status(400).json({ error: 'Recruiter profile not found' });
      }
      whereClause = { application: { internship: { recruiterId } } };
    }

    const interviews = await prisma.interview.findMany({
      where: whereClause,
      include: {
        application: {
          include: {
            internship: {
              include: {
                recruiter: {
                  select: { companyName: true }
                }
              }
            }
          }
        }
      },
      orderBy: { scheduledAt: 'asc' }
    });

    const formatted = interviews.map(item => {
      const scheduledDate = new Date(item.scheduledAt);
      const isUpcoming = scheduledDate > new Date();
      return {
        id: item.id,
        applicationId: item.applicationId,
        companyName: item.application?.internship?.recruiter?.companyName || 'Company',
        position: item.application?.internship?.title || 'Internship',
        interviewDate: scheduledDate.toISOString().split('T')[0],
        interviewTime: scheduledDate.toISOString().split('T')[1].substring(0, 5),
        interviewer: item.interviewer,
        platform: item.platform,
        meetingLink: item.meetingLink,
        notes: item.notes,
        status: isUpcoming ? 'UPCOMING' : 'COMPLETED'
      };
    });

    res.json({ success: true, interviews: formatted });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
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
      if (!req.user.recruiter?.isApproved) {
        return res.status(403).json({ error: 'Your recruiter account is pending approval. You cannot update application statuses until approved.' });
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
  updateApplicationStatus,
  scheduleInterview,
  getInterviews
};


