import pkg from '@prisma/client';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { PrismaClient } = pkg;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const isProduction = process.env.NODE_ENV === 'production';
  const forceMock = process.env.SEED_MOCK_DATA === 'true';
  const skipMock = process.env.SEED_MOCK_DATA === 'false';

  const shouldSeedMock = forceMock || (!isProduction && !skipMock);

  console.log(`Start seeding... (Environment: ${process.env.NODE_ENV || 'development'}, Mock Seeding: ${shouldSeedMock})`);

  // Pre-hashed password for all accounts: 'Password123!'
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Cleansing tables
  console.log('Clearing existing database tables...');
  await prisma.passwordResetToken.deleteMany({});
  await prisma.emailVerificationToken.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.studentSkill.deleteMany({});
  await prisma.internshipSkill.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.companyProfile.deleteMany({});
  await prisma.internship.deleteMany({});
  await prisma.recruiter.deleteMany({});
  await prisma.university.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Database tables cleared.');

  // 2. Seed Skills
  console.log('Seeding skills...');
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

  // 3. Seed Core Demo Users (Always Seeded)
  console.log('Seeding core demo accounts...');
  
  // Student
  const demoStudentUser = await prisma.user.create({
    data: {
      email: 'student@sbridge.com',
      passwordHash,
      role: 'STUDENT',
      isVerified: true
    }
  });

  const demoStudentProfile = await prisma.student.create({
    data: {
      userId: demoStudentUser.id,
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

  const studentSkillsToConnect = ['react', 'node.js', 'javascript', 'git'];
  for (const sName of studentSkillsToConnect) {
    const skillId = skillMap[sName];
    if (skillId) {
      await prisma.studentSkill.create({
        data: {
          studentId: demoStudentProfile.id,
          skillId
        }
      });
    }
  }

  // Recruiter
  const demoRecruiterUser = await prisma.user.create({
    data: {
      email: 'recruiter@sbridge.com',
      passwordHash,
      role: 'RECRUITER',
      isVerified: true
    }
  });

  const demoRecruiterProfile = await prisma.recruiter.create({
    data: {
      userId: demoRecruiterUser.id,
      companyName: 'TechCorp',
      companyWebsite: 'https://techcorp.example.com',
      position: 'HR Director',
      isApproved: true
    }
  });

  await prisma.companyProfile.create({
    data: {
      recruiterId: demoRecruiterProfile.id,
      description: 'A leading technology solutions company building the future of integration.',
      logoUrl: 'http://dummyimage.com/200x100.png/dddddd/000000',
      industry: 'Technology',
      size: '201-500',
      address: '100 Silicon Blvd',
      website: 'https://techcorp.example.com'
    }
  });

  // University
  const demoUniversityUser = await prisma.user.create({
    data: {
      email: 'uni@sbridge.com',
      passwordHash,
      role: 'UNIVERSITY',
      isVerified: true
    }
  });

  await prisma.university.create({
    data: {
      userId: demoUniversityUser.id,
      universityName: 'S-Bridge University',
      domain: 'sbridge.edu',
      contactEmail: 'placements@sbridge.edu'
    }
  });

  // Admin
  await prisma.user.create({
    data: {
      email: 'admin@sbridge.com',
      passwordHash,
      role: 'ADMIN',
      isVerified: true
    }
  });

  console.log('Core demo accounts seeded.');

  // Core Demo Internships
  const demoInternship1 = await prisma.internship.create({
    data: {
      recruiterId: demoRecruiterProfile.id,
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

  const demoInternship2 = await prisma.internship.create({
    data: {
      recruiterId: demoRecruiterProfile.id,
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

  const is1Skills = ['react', 'node.js', 'postgresql'];
  for (const sName of is1Skills) {
    const skillId = skillMap[sName];
    if (skillId) {
      await prisma.internshipSkill.create({
        data: {
          internshipId: demoInternship1.id,
          skillId
        }
      });
    }
  }

  const is2Skills = ['python', 'postgresql'];
  for (const sName of is2Skills) {
    const skillId = skillMap[sName];
    if (skillId) {
      await prisma.internshipSkill.create({
        data: {
          internshipId: demoInternship2.id,
          skillId
        }
      });
    }
  }
  console.log('Core demo internships seeded.');

  // 4. Seed Mock Data if configured
  if (shouldSeedMock) {
    console.log('Reading cleaned mock data files...');
    const students = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/students_clean.json'), 'utf-8'));
    const companies = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/companies_clean.json'), 'utf-8'));
    const internships = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/internships_clean.json'), 'utf-8'));
    const applications = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/applications_clean.json'), 'utf-8'));
    const reports = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/reports_clean.json'), 'utf-8'));

    // A. Seed mock student users
    console.log('Bulk seeding student users...');
    const studentUserRecords = students.map((s, index) => ({
      id: `user-uuid-student-${index + 1}`,
      email: `student_${index + 1}@sbridge.com`,
      passwordHash,
      role: 'STUDENT',
      isVerified: true
    }));
    await prisma.user.createMany({ data: studentUserRecords });

    // B. Seed mock student profiles
    console.log('Bulk seeding student profiles...');
    const studentProfiles = students.map((s, index) => ({
      id: s.id,
      userId: `user-uuid-student-${index + 1}`,
      firstName: s.firstName,
      lastName: s.lastName,
      studentId: s.studentId,
      indexNumber: s.indexNumber,
      phone: s.phone,
      gpa: s.gpa,
      programme: s.programme,
      experience: s.experience,
      cvUrl: s.cvUrl,
      profilePicUrl: s.profilePicUrl
    }));
    await prisma.student.createMany({ data: studentProfiles });

    // C. Seed mock recruiter users
    console.log('Bulk seeding recruiter users...');
    const recruiterUserRecords = companies.map((c, index) => ({
      id: `user-uuid-recruiter-${index + 1}`,
      email: c.recruiterEmail,
      passwordHash,
      role: 'RECRUITER',
      isVerified: true
    }));
    await prisma.user.createMany({ data: recruiterUserRecords });

    // D. Seed mock recruiter profiles
    console.log('Bulk seeding recruiter profiles...');
    const recruiterProfiles = companies.map((c, index) => ({
      id: c.recruiterId,
      userId: `user-uuid-recruiter-${index + 1}`,
      companyName: c.companyName,
      companyWebsite: c.website,
      position: c.position,
      isApproved: true
    }));
    await prisma.recruiter.createMany({ data: recruiterProfiles });

    // E. Seed mock company profiles
    console.log('Bulk seeding company details...');
    const companyProfiles = companies.map((c, index) => ({
      id: c.id,
      recruiterId: c.recruiterId,
      description: c.description,
      logoUrl: c.logoUrl,
      industry: c.industry,
      size: c.size,
      address: c.address,
      website: c.website
    }));
    await prisma.companyProfile.createMany({ data: companyProfiles });

    // F. Seed mock internships
    console.log('Bulk seeding internships...');
    const internshipRecords = internships.map((inst) => ({
      id: inst.id,
      recruiterId: inst.recruiterId,
      title: inst.title,
      description: inst.description,
      location: inst.location,
      internshipType: inst.internshipType,
      salary: inst.salary,
      duration: inst.duration,
      status: inst.status,
      targetProgrammes: inst.targetProgrammes
    }));
    await prisma.internship.createMany({ data: internshipRecords });

    // G. Seed mock applications
    console.log('Bulk seeding applications...');
    const applicationRecords = applications.map((app) => ({
      id: app.id,
      studentId: app.studentId,
      internshipId: app.internshipId,
      coverLetter: app.coverLetter,
      resumeUrl: app.resumeUrl,
      matchScore: app.matchScore,
      status: app.status
    }));
    await prisma.application.createMany({ data: applicationRecords });

    // H. Seed mock reports
    console.log('Bulk seeding weekly logbooks...');
    const reportRecords = reports.map((rep) => ({
      id: rep.id,
      studentId: rep.studentId,
      internshipId: rep.internshipId,
      title: rep.title,
      fileUrl: rep.fileUrl,
      status: rep.status,
      comment: rep.comment
    }));
    await prisma.report.createMany({ data: reportRecords });

    console.log(`Successfully seeded ${students.length} mock students, recruiters, internships, applications, and logbooks.`);
  }

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
