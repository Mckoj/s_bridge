const { register, login, verifyEmail, resendVerification } = require('../controllers/authController');
const prisma = require('../config/db');

async function mockReqRes(body) {
    const req = { body };
    let resData = null;
    let resStatus = 200;
    const res = {
        status: (s) => {
            resStatus = s;
            return res;
        },
        json: (data) => {
            resData = data;
            return res;
        }
    };
    return { req, res, getResult: () => ({ status: resStatus, data: resData }) };
}

async function testEmailVerification() {
    console.log('--- Testing Email Verification Controllers ---');
    try {
        const uniqueEmail = `testuser_${Date.now()}@example.com`;

        console.log(`\n1. Registering user: ${uniqueEmail}`);
        const { req: regReq, res: regRes, getResult: getRegRes } = await mockReqRes({
            email: uniqueEmail,
            password: 'password123',
            role: 'STUDENT',
            firstName: 'Test',
            lastName: 'User'
        });
        await register(regReq, regRes);
        const registerResult = getRegRes();
        console.log(`Registration Status: ${registerResult.status}`);
        if (registerResult.status !== 201) {
            console.error(registerResult.data);
            throw new Error('Registration failed');
        }
        
        console.log('\n2. Retrieving Token/OTP from database directly for testing');
        const tokenRecord = await prisma.emailVerificationToken.findFirst({
            where: { email: uniqueEmail }
        });
        
        if (!tokenRecord) {
            throw new Error('Token record not found in database');
        }

        const [verificationToken, otpCode] = tokenRecord.token.split(':');
        console.log(`Found OTP Code: ${otpCode}`);

        console.log('\n3. Verifying Email with OTP');
        const { req: verReq, res: verRes, getResult: getVerRes } = await mockReqRes({
            email: uniqueEmail,
            otp: otpCode
        });
        await verifyEmail(verReq, verRes);
        const verifyResult = getVerRes();
        console.log(`Verification Status: ${verifyResult.status}`);
        console.log('Verification Response:', verifyResult.data);
        if (verifyResult.status !== 200) {
            throw new Error('Verification failed');
        }

        console.log('\n4. Logging in to confirm verification status');
        const { req: loginReq, res: loginRes, getResult: getLoginRes } = await mockReqRes({
            email: uniqueEmail,
            password: 'password123'
        });
        await login(loginReq, loginRes);
        const loginResult = getLoginRes();
        console.log(`Login Status: ${loginResult.status}`);
        if (loginResult.status !== 200) {
            console.error(loginResult.data);
            throw new Error('Login failed');
        }

        console.log('\n5. Testing Resend Verification');
        const uniqueEmail2 = `testuser_resend_${Date.now()}@example.com`;
        const { req: regReq2, res: regRes2, getResult: getRegRes2 } = await mockReqRes({
            email: uniqueEmail2,
            password: 'password123',
            role: 'STUDENT',
            firstName: 'Test2',
            lastName: 'User2'
        });
        await register(regReq2, regRes2);
        const registerResult2 = getRegRes2();
        
        const { req: resendReq, res: resendRes, getResult: getResendRes } = await mockReqRes({
            email: uniqueEmail2
        });
        await resendVerification(resendReq, resendRes);
        const resendResult = getResendRes();
        console.log(`Resend Status: ${resendResult.status}`);
        console.log('Resend Response:', resendResult.data);
        if (resendResult.status !== 200) {
            throw new Error('Resend failed');
        }
        
        console.log('\n--- ALL TESTS PASSED ---');
        process.exit(0);

    } catch (error) {
        console.error('Test Failed:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testEmailVerification();
