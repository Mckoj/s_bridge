const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../config/db');
const { sendVerificationEmail } = require('../utils/email');

const register = async (email, password, role, profileData = {}) => {
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const { firstName, lastName, studentId, indexNumber, companyName, universityName, domain } = profileData;

    // Validate role-specific fields
    if (role === 'STUDENT') {
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
    } else if (role === 'RECRUITER') {
        if (!companyName) {
            throw new Error('Company name is required for recruiter registration');
        }
    } else if (role === 'UNIVERSITY') {
        if (!universityName || !domain) {
            throw new Error('University name and domain are required for university registration');
        }
        const existingDomain = await prisma.university.findUnique({ where: { domain } });
        if (existingDomain) {
            throw new Error('University domain is already registered');
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token and 6-digit OTP
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Combine token and OTP with a colon delimiter for storage
    const storedToken = `${verificationToken}:${otpCode}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                role: role || "STUDENT",
                isVerified: false
            }
        });

        let profile = null;
        if (role === 'STUDENT') {
            profile = await tx.student.create({
                data: {
                    userId: newUser.id,
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
        } else if (role === 'UNIVERSITY') {
            profile = await tx.university.create({
                data: {
                    userId: newUser.id,
                    universityName,
                    domain
                }
            });
        }

        // Save email verification token record
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
            isVerified: newUser.isVerified,
            createdAt: newUser.createdAt,
            profile
        };
    });

    // Dispatch verification email (non-blocking)
    sendVerificationEmail(email, verificationToken, otpCode).catch((err) => {
        console.error('Failed to send verification email:', err);
    });

    return result;
};

module.exports = { register };