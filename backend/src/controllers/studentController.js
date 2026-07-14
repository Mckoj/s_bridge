const prisma = require('../config/db');

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

    const student = await prisma.student.findUnique({
      where: { id },
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

    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    if (req.user.role !== 'ADMIN' && req.user.student?.id !== student.id) {
      return res.status(403).json({ error: 'Unauthorized to modify this profile' });
    }

    const updatedStudent = await prisma.$transaction(async (tx) => {
      const updated = await tx.student.update({
        where: { id },
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
          where: { studentId: id }
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
              studentId: id,
              skillId: dbSkill.id
            }
          });
        }
      }

      return tx.student.findUnique({
        where: { id },
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
    const student = await prisma.student.findUnique({ where: { id } });
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

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};
