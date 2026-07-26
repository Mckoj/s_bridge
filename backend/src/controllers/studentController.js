const prisma = require('../config/db');
const { uploadToCloudinary } = require('../utils/cloudinary');

async function getAllStudents(req, res) {
  try {
    const students = await prisma.student.findMany({
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
        name: 'University Placement Coordinator',
        email: 'coordinator@university.edu'
      },
      status: 'ACTIVE'
    };

    res.json(responseData);
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

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getActiveInternship,
  getStudentApplications,
  getStudentStats,
  uploadCV,
  uploadAvatar
};


