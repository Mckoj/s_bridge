const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

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

    const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                role: role || "STUDENT"
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

        return {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt,
            profile
        };
    });

    return result;
}

module.exports = { register };