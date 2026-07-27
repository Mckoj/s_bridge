const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const authService = require('../services/authServices');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');

const register = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing. Make sure Content-Type is application/json' });
        }
        const { email, password, role, ...profileData } = req.body;
        const user = await authService.register(email, password, role, profileData);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                student: { select: { firstName: true, lastName: true, profilePicUrl: true } },
                recruiter: { select: { companyName: true } },
                university: { select: { universityName: true } }
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.student?.firstName ?? user.recruiter?.companyName ?? user.university?.universityName ?? null,
                lastName: user.student?.lastName ?? null
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token, email, otp } = req.body;
        
        if (!token && (!email || !otp)) {
            return res.status(400).json({ message: 'Token or email and OTP are required' });
        }

        let tokenRecords;
        if (token) {
             tokenRecords = await prisma.emailVerificationToken.findMany({
                 where: { token: { startsWith: `${token}:` } }
             });
        } else {
             tokenRecords = await prisma.emailVerificationToken.findMany({
                 where: { email, token: { endsWith: `:${otp}` } }
             });
        }

        if (tokenRecords.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired token/OTP' });
        }

        const tokenRecord = tokenRecords[0];

        if (tokenRecord.expiresAt < new Date()) {
            await prisma.emailVerificationToken.delete({ where: { id: tokenRecord.id } });
            return res.status(400).json({ message: 'Verification token has expired. Please request a new one.' });
        }

        await prisma.user.update({
            where: { id: tokenRecord.userId },
            data: { isVerified: true }
        });

        await prisma.emailVerificationToken.deleteMany({
            where: { userId: tokenRecord.userId }
        });

        res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        // Generate verification token and 6-digit OTP
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const storedToken = `${verificationToken}:${otpCode}`;
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Delete existing tokens for the user
        await prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } });

        await prisma.emailVerificationToken.create({
            data: {
                userId: user.id,
                email: user.email,
                token: storedToken,
                expiresAt
            }
        });

        sendVerificationEmail(email, verificationToken, otpCode).catch((err) => {
            console.error('Failed to resend verification email:', err);
        });

        res.json({ success: true, message: 'Verification email resent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Always respond success even if user not found (security: don't leak whether email exists)
        if (!user) {
            return res.json({ success: true, message: 'If this email is registered, a reset code has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const storedToken = `${resetToken}:${otpCode}`;
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Delete any existing reset tokens for this user
        await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                email: user.email,
                token: storedToken,
                expiresAt
            }
        });

        sendPasswordResetEmail(email, resetToken, otpCode).catch((err) => {
            console.error('Failed to send password reset email:', err);
        });

        res.json({ success: true, message: 'If this email is registered, a reset code has been sent.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Find the reset token by matching email and OTP suffix
        const tokenRecords = await prisma.passwordResetToken.findMany({
            where: { email, token: { endsWith: `:${otp}` } }
        });

        if (tokenRecords.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const tokenRecord = tokenRecords[0];

        if (tokenRecord.expiresAt < new Date()) {
            await prisma.passwordResetToken.delete({ where: { id: tokenRecord.id } });
            return res.status(400).json({ message: 'Reset code has expired. Please request a new one.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: tokenRecord.userId },
            data: { passwordHash: hashedPassword }
        });

        await prisma.passwordResetToken.deleteMany({ where: { userId: tokenRecord.userId } });

        res.json({ success: true, message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: hashedPassword }
        });

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, verifyEmail, resendVerification, forgotPassword, resetPassword, changePassword };