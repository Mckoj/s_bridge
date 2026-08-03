const prisma = require('../config/db');

async function createInternship(req, res) {
  try {
    const recruiter = req.user.recruiter;
    if (!recruiter) {
      return res.status(403).json({ error: 'Only registered recruiters can post internships' });
    }

    // Block unapproved recruiters from publishing listings
    if (!recruiter.isApproved) {
      return res.status(403).json({ error: 'Your recruiter account is pending approval. You cannot post internships until approved by the university.' });
    }

    const { title, description, location, internshipType, salary, duration, targetProgrammes, skills } = req.body;

    if (!title || !description || !location || !internshipType || !duration) {
      return res.status(400).json({ error: 'Title, description, location, internshipType, and duration are required' });
    }

    const internship = await prisma.$transaction(async (tx) => {
      const created = await tx.internship.create({
        data: {
          recruiterId: recruiter.id,
          title,
          description,
          location,
          internshipType,
          salary: salary ? parseFloat(salary) : null,
          duration,
          targetProgrammes: Array.isArray(targetProgrammes) ? targetProgrammes.join(', ') : targetProgrammes || null,
          status: 'OPEN'
        }
      });

      if (skills && Array.isArray(skills)) {
        for (const skillName of skills) {
          const trimmedSkill = skillName.trim().toLowerCase();
          if (trimmedSkill.length === 0) continue;

          const dbSkill = await tx.skill.upsert({
            where: { name: trimmedSkill },
            update: {},
            create: { name: trimmedSkill }
          });

          await tx.internshipSkill.create({
            data: {
              internshipId: created.id,
              skillId: dbSkill.id
            }
          });
        }
      }

      return tx.internship.findUnique({
        where: { id: created.id },
        include: {
          recruiter: {
            include: { companyProfile: true }
          },
          skills: {
            include: { skill: true }
          }
        }
      });
    });

    res.status(201).json({ success: true, internship });
  } catch (error) {
    console.error('Error creating internship:', error);
    res.status(500).json({ error: 'Failed to create internship listing' });
  }
}

async function getAllInternships(req, res) {
  try {
    const { search, location, internshipType, status, skill } = req.query;

    let whereClause = {};

    // Recruiter users should only see their own postings
    if (req.user.role === 'RECRUITER' && req.user.recruiter?.id) {
      whereClause.recruiterId = req.user.recruiter.id;
    }

    // Filter status (defaults to OPEN if not specified)
    if (status) {
      whereClause.status = status;
    } else if (req.user.role !== 'RECRUITER') {
      // Non-recruiter callers default to OPEN; recruiters see all their own statuses
      whereClause.status = 'OPEN';
    }

    if (location) {
      whereClause.location = { contains: location, mode: 'insensitive' };
    }

    if (internshipType) {
      whereClause.internshipType = { equals: internshipType, mode: 'insensitive' };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { recruiter: { companyName: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (skill) {
      whereClause.skills = {
        some: {
          skill: {
            name: { contains: skill.toLowerCase().trim(), mode: 'insensitive' }
          }
        }
      };
    }

    const internships = await prisma.internship.findMany({
      where: whereClause,
      include: {
        recruiter: {
          select: {
            id: true,
            companyName: true,
            companyWebsite: true,
            companyProfile: {
              select: { logoUrl: true, address: true, industry: true }
            }
          }
        },
        skills: {
          include: { skill: true }
        },
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // If the caller is a student, compute match scores using their skills
    let enrichedInternships = internships;
    if (req.user && req.user.role === 'STUDENT' && req.user.student?.skills) {
      const studentSkillNames = new Set(
        req.user.student.skills.map(s => s.skill.name.toLowerCase())
      );

      enrichedInternships = internships.map(internship => {
        const requiredSkills = internship.skills.map(s => s.skill.name.toLowerCase());
        if (requiredSkills.length === 0) {
          return { ...internship, matchScore: 0 };
        }
        const matchingCount = requiredSkills.filter(s => studentSkillNames.has(s)).length;
        const matchScore = Math.round((matchingCount / requiredSkills.length) * 100);
        return { ...internship, matchScore };
      });
    }

    res.json({ success: true, count: enrichedInternships.length, internships: enrichedInternships });
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
}

async function getInternshipById(req, res) {
  try {
    const { id } = req.params;

    const internship = await prisma.internship.findUnique({
      where: { id },
      include: {
        recruiter: {
          include: { companyProfile: true }
        },
        skills: {
          include: { skill: true }
        },
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!internship) {
      return res.status(404).json({ error: 'Internship listing not found' });
    }

    res.json({ success: true, internship });
  } catch (error) {
    console.error('Error fetching internship detail:', error);
    res.status(500).json({ error: 'Failed to fetch internship details' });
  }
}

async function updateInternship(req, res) {
  try {
    const { id } = req.params;
    const { title, description, location, internshipType, salary, duration, status, skills } = req.body;

    const existing = await prisma.internship.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Internship listing not found' });
    }

    // Check ownership and approval if user is a recruiter
    if (req.user.role === 'RECRUITER') {
      if (req.user.recruiter?.id !== existing.recruiterId) {
        return res.status(403).json({ error: 'Unauthorized to modify this internship listing' });
      }
      if (!req.user.recruiter?.isApproved) {
        return res.status(403).json({ error: 'Your recruiter account is pending approval. You cannot modify internships until approved.' });
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.internship.update({
        where: { id },
        data: {
          title: title || existing.title,
          description: description || existing.description,
          location: location || existing.location,
          internshipType: internshipType || existing.internshipType,
          salary: salary !== undefined ? (salary ? parseFloat(salary) : null) : existing.salary,
          duration: duration || existing.duration,
          status: status || existing.status
        }
      });

      if (skills && Array.isArray(skills)) {
        await tx.internshipSkill.deleteMany({
          where: { internshipId: id }
        });

        for (const skillName of skills) {
          const trimmedSkill = skillName.trim().toLowerCase();
          if (trimmedSkill.length === 0) continue;

          const dbSkill = await tx.skill.upsert({
            where: { name: trimmedSkill },
            update: {},
            create: { name: trimmedSkill }
          });

          await tx.internshipSkill.create({
            data: {
              internshipId: id,
              skillId: dbSkill.id
            }
          });
        }
      }

      return tx.internship.findUnique({
        where: { id },
        include: {
          recruiter: { include: { companyProfile: true } },
          skills: { include: { skill: true } }
        }
      });
    });

    res.json({ success: true, internship: updated });
  } catch (error) {
    console.error('Error updating internship:', error);
    res.status(500).json({ error: 'Failed to update internship listing' });
  }
}

async function deleteInternship(req, res) {
  try {
    const { id } = req.params;
    const existing = await prisma.internship.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Internship listing not found' });
    }

    if (req.user.role === 'RECRUITER' && req.user.recruiter?.id !== existing.recruiterId) {
      return res.status(403).json({ error: 'Unauthorized to delete this internship listing' });
    }

    await prisma.internship.delete({ where: { id } });

    res.json({ success: true, message: 'Internship listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting internship:', error);
    res.status(500).json({ error: 'Failed to delete internship listing' });
  }
}

module.exports = {
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  deleteInternship
};
