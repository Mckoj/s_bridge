import pkg from '@prisma/client';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = pkg;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');
  
  // Pre-hashed password for the dev users: 'Password123!'
  const passwordHash = await bcrypt.hash('Password123!', 10);
  
  // 1. Seed Student User
  const studentEmail = 'student@sbridge.com';
  await prisma.user.upsert({
    where: { email: studentEmail },
    update: { passwordHash, isVerified: true },
    create: {
      email: studentEmail,
      passwordHash,
      role: 'STUDENT',
      isVerified: true
    }
  });
  console.log('Student user seeded.');

  // 2. Seed Recruiter User
  const recruiterEmail = 'recruiter@sbridge.com';
  await prisma.user.upsert({
    where: { email: recruiterEmail },
    update: { passwordHash, isVerified: true },
    create: {
      email: recruiterEmail,
      passwordHash,
      role: 'RECRUITER',
      isVerified: true
    }
  });
  console.log('Recruiter user seeded.');

  // 3. Seed University User
  const universityEmail = 'uni@sbridge.com';
  await prisma.user.upsert({
    where: { email: universityEmail },
    update: { passwordHash, isVerified: true },
    create: {
      email: universityEmail,
      passwordHash,
      role: 'UNIVERSITY',
      isVerified: true
    }
  });
  console.log('University user seeded.');

  // 4. Seed Admin User
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
