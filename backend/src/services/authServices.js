const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

const register = async (email, password, role, studentId, indexNumber) => {
    const existingUser = await prisma.user.findUnique({
        where: {email}
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    if (role === 'STUDENT') {
        if (studentId) {
            const existingStudentId = await prisma.user.findUnique({ where: { studentId } });
            if (existingStudentId) {
                throw new Error('Student ID is already registered');
            }
        }
        if (indexNumber) {
            const existingIndex = await prisma.user.findUnique({ where: { indexNumber } });
            if (existingIndex) {
                throw new Error('Index number is already registered');
            }
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            passwordHash: hashedPassword,
            role: role || "STUDENT",
            studentId: role === 'STUDENT' ? studentId : null,
            indexNumber: role === 'STUDENT' ? indexNumber : null
        },
        select:{
            id: true,
            email: true,
            role:true,
            studentId: true,
            indexNumber: true,
            createdAt: true
        }
    });

    return newUser;
}
module.exports = { register };