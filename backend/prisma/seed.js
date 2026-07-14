import pkg from '@prisma/client';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = pkg;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SKILLS = [
  'React',
  'Node.js',
  'Express.js',
  'PostgreSQL',
  'Tailwind CSS',
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'Git',
  'REST APIs',
  'Docker',
  'Unit Testing',
  'HTML5',
  'CSS3',
  'Prisma ORM',
  'AWS'
];

async function main() {
  console.log('Start seeding...');
  
  // 1. Seed Skills
  const skillMap = {};
  for (const skillName of SKILLS) {
    const nameLower = skillName.trim().toLowerCase();
    const skill = await prisma.skill.upsert({
      where: { name: nameLower },
      update: {},
      create: { name: nameLower }
    });
    skillMap[nameLower] = skill.id;
  }
  console.log('Skills seeded successfully.');

  // Pre-hashed password for the demo users: 'Password123!'
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 2. Seed Student User
  const studentEmail = 'student@sbridge.com';
  const studentUser = await prisma.user.upsert({
    where: { email: studentEmail },
    update: { passwordHash, isVerified: true },
    create: {
      email: studentEmail,
      passwordHash,
      role: 'STUDENT',
      isVerified: true
    }
  });

  const studentProfile = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {
      firstName: 'Alex',
      lastName: 'Rivera',
      studentId: 'ST-99887',
      indexNumber: 'IDX-11223',
      phone: '+1234567890',
      gpa: 3.8,
      programme: 'Computer Science',
      experience: 'Frontend Development intern at CodeCrafters (3 months). Built multiple React interactive projects.'
    },
    create: {
      userId: studentUser.id,
      firstName: 'Alex',
      lastName: 'Rivera',
      studentId: 'ST-99887',
      indexNumber: 'IDX-11223',
      phone: '+1234567890',
      gpa: 3.8,
      programme: 'Computer Science',
      experience: 'Frontend Development intern at CodeCrafters (3 months). Built multiple React interactive projects.'
    }
  });

  // Connect student to some skills
  const studentSkillsToConnect = ['react', 'node.js', 'javascript', 'git'];
  for (const sName of studentSkillsToConnect) {
    const skillId = skillMap[sName];
    if (skillId) {
      await prisma.studentSkill.upsert({
        where: {
          studentId_skillId: {
            studentId: studentProfile.id,
            skillId
          }
        },
        update: {},
        create: {
          studentId: studentProfile.id,
          skillId
        }
      });
    }
  }
  console.log('Student user, profile, and skills seeded.');

  // 3. Seed Recruiter User
  const recruiterEmail = 'recruiter@sbridge.com';
  const recruiterUser = await prisma.user.upsert({
    where: { email: recruiterEmail },
    update: { passwordHash, isVerified: true },
    create: {
      email: recruiterEmail,
      passwordHash,
      role: 'RECRUITER',
      isVerified: true
    }
  });

  const recruiterProfile = await prisma.recruiter.upsert({
    where: { userId: recruiterUser.id },
    update: {
      companyName: 'TechCorp',
      companyWebsite: 'https://techcorp.example.com',
      position: 'HR Director',
      isApproved: true
    },
    create: {
      userId: recruiterUser.id,
      companyName: 'TechCorp',
      companyWebsite: 'https://techcorp.example.com',
      position: 'HR Director',
      isApproved: true
    }
  });
  console.log('Recruiter user and profile seeded.');

  // 4. Seed University User
  const universityEmail = 'uni@sbridge.com';
  const universityUser = await prisma.user.upsert({
    where: { email: universityEmail },
    update: { passwordHash, isVerified: true },
    create: {
      email: universityEmail,
      passwordHash,
      role: 'UNIVERSITY',
      isVerified: true
    }
  });

  await prisma.university.upsert({
    where: { userId: universityUser.id },
    update: {
      universityName: 'S-Bridge University',
      domain: 'sbridge.edu',
      contactEmail: 'placements@sbridge.edu'
    },
    create: {
      userId: universityUser.id,
      universityName: 'S-Bridge University',
      domain: 'sbridge.edu',
      contactEmail: 'placements@sbridge.edu'
    }
  });
  console.log('University user and profile seeded.');

  // 5. Seed Admin User
  const adminEmail = 'admin@sbridge.com';
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, isVerified: true },
    create: {
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
      isVerified: true
    }
  });
  console.log('Admin user seeded.');

  // Clean up any old internships/relationships to allow fresh seed execution
  await prisma.internship.deleteMany({
    where: { recruiterId: recruiterProfile.id }
  });

  // 6. Seed some internships from TechCorp
  const internship1 = await prisma.internship.create({
    data: {
      recruiterId: recruiterProfile.id,
      title: 'Full-Stack Developer Intern',
      description: 'Looking for a passionate Full-Stack developer intern. You will work with React, Node.js, and PostgreSQL to build scalable web APIs.',
      location: 'Remote',
      internshipType: 'REMOTE',
      salary: 1500,
      duration: '3 Months',
      status: 'OPEN',
      targetProgrammes: 'Computer Science, Software Engineering'
    }
  });

  const internship2 = await prisma.internship.create({
    data: {
      recruiterId: recruiterProfile.id,
      title: 'Data Analyst Intern',
      description: 'Learn data analysis using Python and SQL. Help build beautiful tracking dashboards.',
      location: 'New York, NY',
      internshipType: 'HYBRID',
      salary: 1200,
      duration: '6 Months',
      status: 'OPEN',
      targetProgrammes: 'Data Science, Computer Science, Statistics'
    }
  });

  // Connect skills to Full-Stack Internship (React, Node.js, PostgreSQL)
  const is1Skills = ['react', 'node.js', 'postgresql'];
  for (const sName of is1Skills) {
    const skillId = skillMap[sName];
    if (skillId) {
      await prisma.internshipSkill.create({
        data: {
          internshipId: internship1.id,
          skillId
        }
      });
    }
  }

  // Connect skills to Data Analyst Internship (Python, PostgreSQL)
  const is2Skills = ['python', 'postgresql'];
  for (const sName of is2Skills) {
    const skillId = skillMap[sName];
    if (skillId) {
      await prisma.internshipSkill.create({
        data: {
          internshipId: internship2.id,
          skillId
        }
      });
    }
  }
  console.log('Internships and their requirements seeded.');

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
