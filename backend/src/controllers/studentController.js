const prisma = require('../config/db');
const { uploadToCloudinary } = require('../utils/cloudinary');

async function getAllStudents(req, res) {
  try {
    let whereClause = {};
    if (req.user && req.user.role === 'UNIVERSITY') {
      const universityId = req.user.universityId || req.user.university?.id;
      if (universityId) {
        whereClause.universityId = universityId;
      }
    }

    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        skills: {
          include: { skill: true }
        },
        user: {
          select: { email: true, isVerified: true }
        }
      }
    });
    res.json({ success: true, students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students list' });
  }
}

async function getStudentById(req, res) {
  try {
    const { id } = req.params;

    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { id },
          { userId: id }
        ]
      },
      include: {
        skills: {
          include: { skill: true }
        },
        user: {
          select: { email: true, role: true }
        },
        applications: {
          include: {
            internship: {
              include: { recruiter: true }
            }
          }
        },
        reports: true
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Role-based access validation (IDOR Prevention & Multi-Tenant Scoping)
    const { role } = req.user;
    const userUniId = req.user.universityId || req.user.university?.id;
    const isSelf = req.user.student?.id === student.id || req.user.id === student.userId;
    const isAdmin = role === 'ADMIN';
    const isUniversity = role === 'UNIVERSITY' && userUniId && student.universityId === userUniId;

    let isAuthorizedRecruiter = false;
    if (role === 'RECRUITER' && req.user.recruiter?.id) {
      const activeApp = await prisma.application.findFirst({
        where: {
          studentId: student.id,
          internship: { recruiterId: req.user.recruiter.id }
        }
      });
      if (activeApp) isAuthorizedRecruiter = true;
    }

    if (!isSelf && !isAdmin && !isUniversity && !isAuthorizedRecruiter) {
      return res.status(403).json({ error: 'Unauthorized to view this student profile' });
    }

    res.json({ success: true, student });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
}

async function updateStudent(req, res) {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, gpa, programme, experience, cvUrl, profilePicUrl, skills } = req.body;

    const student = await prisma.student.findFirst({ 
      where: { 
        OR: [
          { id },
          { userId: id }
        ]
      } 
    });
    
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    if (req.user.role !== 'ADMIN' && req.user.student?.id !== student.id) {
      return res.status(403).json({ error: 'Unauthorized to modify this profile' });
    }

    const updatedStudent = await prisma.$transaction(async (tx) => {
      const updated = await tx.student.update({
        where: { id: student.id },
        data: {
          firstName,
          lastName,
          phone,
          gpa: gpa ? parseFloat(gpa) : null,
          programme,
          experience,
          cvUrl,
          profilePicUrl
        }
      });

      if (skills && Array.isArray(skills)) {
        await tx.studentSkill.deleteMany({
          where: { studentId: student.id }
        });

        for (const skillName of skills) {
          const trimmedSkill = skillName.trim().toLowerCase();
          if (trimmedSkill.length === 0) continue;

          const dbSkill = await tx.skill.upsert({
            where: { name: trimmedSkill },
            update: {},
            create: { name: trimmedSkill }
          });

          await tx.studentSkill.create({
            data: {
              studentId: student.id,
              skillId: dbSkill.id
            }
          });
        }
      }

      return tx.student.findUnique({
        where: { id: student.id },
        include: {
          skills: {
            include: { skill: true }
          }
        }
      });
    });

    res.json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ error: 'Failed to update student profile' });
  }
}

async function deleteStudent(req, res) {
  try {
    const { id } = req.params;
    const student = await prisma.student.findFirst({ 
      where: { 
        OR: [
          { id },
          { userId: id }
        ]
      } 
    });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    await prisma.user.delete({
      where: { id: student.userId }
    });

    res.json({ success: true, message: 'Student account deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student account' });
  }
}

async function getActiveInternship(req, res) {
  try {
    const student = req.user.student;
    if (!student) {
      return res.status(403).json({ error: 'Only students can view active internships' });
    }

    const activeApp = await prisma.application.findFirst({
      where: {
        studentId: student.id,
        status: 'ACCEPTED'
      },
      include: {
        internship: {
          include: {
            recruiter: {
              include: { companyProfile: true }
            }
          }
        }
      }
    });

    if (!activeApp) {
      return res.json(null);
    }

    const internship = activeApp.internship;
    const recruiter = internship.recruiter;
    const profile = recruiter.companyProfile;

    let universityInfo = null;
    if (student.universityId) {
      universityInfo = await prisma.university.findUnique({
        where: { id: student.universityId }
      });
    }

    const responseData = {
      id: internship.id,
      title: internship.title,
      companyName: recruiter.companyName,
      companyAddress: profile?.address || internship.location,
      companyLogo: profile?.logoUrl || '',
      startDate: activeApp.updatedAt.toISOString().split('T')[0],
      endDate: 'Ongoing',
      internshipType: internship.internshipType,
      companySupervisor: {
        name: `${recruiter.position || 'Recruiter Supervisor'}`,
        email: recruiter.companyWebsite || '',
        position: recruiter.position || 'Supervisor'
      },
      universitySupervisor: {
        name: universityInfo ? `${universityInfo.universityName} Placement Office` : 'University Placement Coordinator',
        email: universityInfo?.contactEmail || 'coordinator@university.edu'
      },
      status: 'ACTIVE'
    };

    res.json({ success: true, internship: responseData, ...responseData });
  } catch (error) {
    console.error('Error fetching active internship:', error);
    res.status(500).json({ error: 'Failed to fetch active internship' });
  }
}

async function getStudentApplications(req, res) {
  try {
    const student = req.user.student;
    if (!student) {
      return res.status(403).json({ error: 'Only students can view their applications' });
    }

    const applications = await prisma.application.findMany({
      where: { studentId: student.id },
      include: {
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

    const formatted = applications.map(app => ({
      id: app.id,
      internshipId: app.internshipId,
      internshipTitle: app.internship.title,
      companyName: app.internship.recruiter.companyName,
      location: app.internship.location,
      internshipType: app.internship.internshipType,
      appliedDate: app.createdAt.toISOString().split('T')[0],
      status: app.status,
      coverLetter: app.coverLetter,
      matchScore: app.matchScore
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching student applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
}

async function getStudentStats(req, res) {
  try {
    const student = req.user.student;
    if (!student) {
      return res.status(403).json({ error: 'Only registered students can view stats' });
    }

    const studentId = student.id;

    const totalApplications = await prisma.application.count({
      where: { studentId }
    });

    const pendingReviews = await prisma.application.count({
      where: {
        studentId,
        status: { in: ['PENDING', 'REVIEWING'] }
      }
    });

    const acceptedOffers = await prisma.application.count({
      where: {
        studentId,
        status: 'ACCEPTED'
      }
    });

    const submittedReports = await prisma.report.count({
      where: { studentId }
    });

    res.json({
      success: true,
      stats: {
        totalApplications,
        pendingReviews,
        acceptedOffers,
        submittedReports
      }
    });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({ error: 'Failed to fetch student statistics' });
  }
}

async function uploadCV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please attach a PDF file.' });
    }

    const student = req.user.student;
    if (!student) {
      return res.status(403).json({ error: 'Only students can upload a CV' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'cvs', 'raw');

    const updated = await prisma.student.update({
      where: { id: student.id },
      data: { cvUrl: result.url }
    });

    res.json({ success: true, message: 'CV uploaded successfully', cvUrl: updated.cvUrl });
  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ error: error.message || 'Failed to upload CV' });
  }
}

async function uploadAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please attach an image file.' });
    }

    const student = req.user.student;
    if (!student) {
      return res.status(403).json({ error: 'Only students can upload a profile picture' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'profiles', 'image');

    const updated = await prisma.student.update({
      where: { id: student.id },
      data: { profilePicUrl: result.url }
    });

    res.json({ success: true, message: 'Profile picture uploaded successfully', profilePicUrl: updated.profilePicUrl });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: error.message || 'Failed to upload profile picture' });
  }
}

async function saveJob(req, res) {
  try {
    const student = req.user.student;
    if (!student) {
      return res.status(403).json({ error: 'Only students can save jobs' });
    }

    const { internshipId } = req.body;
    const targetInternshipId = internshipId || req.params.internshipId;

    if (!targetInternshipId) {
      return res.status(400).json({ error: 'Internship ID is required' });
    }

    const internship = await prisma.internship.findUnique({
      where: { id: targetInternshipId }
    });

    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    const savedJob = await prisma.savedJob.upsert({
      where: {
        studentId_internshipId: {
          studentId: student.id,
          internshipId: targetInternshipId
        }
      },
      update: {},
      create: {
        studentId: student.id,
        internshipId: targetInternshipId
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

    res.status(201).json({ success: true, savedJob });
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({ error: 'Failed to save job' });
  }
}

async function getSavedJobs(req, res) {
  try {
    const student = req.user.student;
    if (!student) {
      return res.status(403).json({ error: 'Only students can view saved jobs' });
    }

    const savedJobs = await prisma.savedJob.findMany({
      where: { studentId: student.id },
      include: {
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

    const formatted = savedJobs.map(sj => ({
      id: sj.id,
      internshipId: sj.internshipId,
      title: sj.internship.title,
      companyName: sj.internship.recruiter.companyName,
      location: sj.internship.location,
      internshipType: sj.internship.internshipType,
      duration: sj.internship.duration,
      salary: sj.internship.salary ? `$${sj.internship.salary}` : undefined,
      savedAt: sj.createdAt.toISOString()
    }));

    res.json({ success: true, savedJobs: formatted });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    res.status(500).json({ error: 'Failed to fetch saved jobs' });
  }
}

async function removeSavedJob(req, res) {
  try {
    const student = req.user.student;
    if (!student) {
      return res.status(403).json({ error: 'Only students can remove saved jobs' });
    }

    const { id } = req.params;

    await prisma.savedJob.deleteMany({
      where: {
        studentId: student.id,
        OR: [
          { id },
          { internshipId: id }
        ]
      }
    });

    res.json({ success: true, message: 'Job removed from saved jobs' });
  } catch (error) {
    console.error('Error removing saved job:', error);
    res.status(500).json({ error: 'Failed to remove saved job' });
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getActiveInternship,
  getStudentApplications,
  getStudentStats,
  uploadCV,
  uploadAvatar,
  saveJob,
  getSavedJobs,
  removeSavedJob
};



