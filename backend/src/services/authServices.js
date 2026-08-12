const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../config/db');
const { sendVerificationEmail } = require('../utils/email');

const register = async (email, password, role, profileData = {}) => {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail }
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const { firstName, lastName, studentId, indexNumber, companyName } = profileData;

    let universityId = null;

    if (role === 'UNIVERSITY') {
        const domain = normalizedEmail.split('@')[1];
        if (!domain) {
            throw new Error('Invalid email address');
        }

        const university = await prisma.university.findUnique({
            where: { domain: domain.toLowerCase() }
        });

        if (!university) {
            throw new Error('Invalid institutional domain');
        }

        if (!university.isVerified) {
            throw new Error('University is not currently approved');
        }

        universityId = university.id;
    } else if (role === 'STUDENT') {
        if (!firstName || !lastName) {
            throw new Error('First name and last name are required for student registration');
        }
        if (studentId) {
            const existingStudentId = await prisma.student.findUnique({ where: { studentId } });
            if (existingStudentId) {
                throw new Error('Student ID is already registered');
            }
        }
        if (indexNumber) {
            const existingIndex = await prisma.student.findUnique({ where: { indexNumber } });
            if (existingIndex) {
                throw new Error('Index number is already registered');
            }
        }

        const domain = normalizedEmail.split('@')[1];
        if (domain) {
            const university = await prisma.university.findUnique({
                where: { domain: domain.toLowerCase() }
            });
            if (university && university.isVerified) {
                universityId = university.id;
            }
        }
    } else if (role === 'RECRUITER') {
        if (!companyName) {
            throw new Error('Company name is required for recruiter registration');
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const storedToken = `${verificationToken}:${otpCode}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                email: normalizedEmail,
                passwordHash: hashedPassword,
                role: role || "STUDENT",
                isVerified: false,
                universityId
            }
        });

        let profile = null;
        if (role === 'STUDENT') {
            profile = await tx.student.create({
                data: {
                    userId: newUser.id,
                    universityId,
                    firstName,
                    lastName,
                    studentId: studentId || null,
                    indexNumber: indexNumber || null
                }
            });
        } else if (role === 'RECRUITER') {
            profile = await tx.recruiter.create({
                data: {
                    userId: newUser.id,
                    companyName,
                    isApproved: false
                }
            });
        }

        await tx.emailVerificationToken.create({
            data: {
                userId: newUser.id,
                email: newUser.email,
                token: storedToken,
                expiresAt
            }
        });

        return {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            universityId: newUser.universityId,
            isVerified: newUser.isVerified,
            createdAt: newUser.createdAt,
            profile
        };
    });

    sendVerificationEmail(normalizedEmail, verificationToken, otpCode).catch((err) => {
        console.error('Failed to send verification email:', err);
    });

    return result;
};

module.exports = { register };