const prisma = require('../config/db');
require('dotenv').config({ path: '../../.env' });

// Minimal mock request/response helper
function mockReqRes(body = {}, params = {}, user = null) {
  const result = { status: null, data: null };
  const req = { body, params, user };
  const res = {
    status(code) { result.status = code; return res; },
    json(data) {
      if (!result.status) result.status = 200;
      result.data = data;
      return res;
    }
  };
  return { req, res, getResult: () => result };
}

const { forgotPassword, resetPassword, login } = require('../controllers/authController');

async function testPasswordReset() {
  console.log('=== Testing Password Reset Flow ===\n');

  // Use a test user created for this purpose
  const testEmail = `pw_reset_test_${Date.now()}@test.com`;
  const originalPassword = 'OriginalPass123';
  const newPassword = 'NewPass456';
  let testUserId = null;

  try {
    // 1. Create a test user
    console.log('1. Creating temporary test user...');
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash(originalPassword, 10);
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: hash,
        role: 'STUDENT',
        isVerified: true
      }
    });
    testUserId = testUser.id;
    console.log(`   Created user: ${testEmail}`);

    // 2. Request a password reset
    console.log('\n2. Testing POST /api/auth/forgot-password...');
    const { req: fReq, res: fRes, getResult: getFResult } = mockReqRes({ email: testEmail });
    await forgotPassword(fReq, fRes);
    const fResult = getFResult();
    console.log(`   Status: ${fResult.status}`);
    console.log(`   Message: ${fResult.data?.message}`);
    if (fResult.status !== 200) throw new Error('forgot-password failed');
    console.log('   ✅ forgotPassword PASSED');

    // 3. Retrieve the generated OTP from the database
    console.log('\n3. Fetching OTP from PasswordResetToken table...');
    const tokenRecord = await prisma.passwordResetToken.findFirst({
      where: { userId: testUserId }
    });
    if (!tokenRecord) throw new Error('No PasswordResetToken record found — forgot-password may not have saved token');
    const storedOtp = tokenRecord.token.split(':')[1];
    console.log(`   OTP retrieved: ${storedOtp}`);

    // 4. Reset the password using the OTP
    console.log('\n4. Testing POST /api/auth/reset-password with correct OTP...');
    const { req: rReq, res: rRes, getResult: getRResult } = mockReqRes({
      email: testEmail,
      otp: storedOtp,
      newPassword
    });
    await resetPassword(rReq, rRes);
    const rResult = getRResult();
    console.log(`   Status: ${rResult.status}`);
    console.log(`   Message: ${rResult.data?.message}`);
    if (rResult.status !== 200) throw new Error('reset-password failed: ' + JSON.stringify(rResult.data));
    console.log('   ✅ resetPassword PASSED');

    // 5. Verify old password no longer works
    console.log('\n5. Verifying old password is rejected...');
    const { req: lOldReq, res: lOldRes, getResult: getOldResult } = mockReqRes({ email: testEmail, password: originalPassword });
    await login(lOldReq, lOldRes);
    const oldResult = getOldResult();
    console.log(`   Status with old password: ${oldResult.status} (expected 401)`);
    if (oldResult.status !== 401) throw new Error('Old password should have been rejected');
    console.log('   ✅ Old password correctly rejected');

    // 6. Verify new password now works
    console.log('\n6. Verifying new password is accepted...');
    const { req: lNewReq, res: lNewRes, getResult: getNewResult } = mockReqRes({ email: testEmail, password: newPassword });
    await login(lNewReq, lNewRes);
    const newResult = getNewResult();
    console.log(`   Status with new password: ${newResult.status} (expected 200)`);
    if (newResult.status !== 200) throw new Error('New password login failed');
    console.log('   ✅ New password accepted — Login successful');

    console.log('\n=== ✅ Password Reset Flow Testing Completed Successfully ===');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  } finally {
    // Cleanup test user
    if (testUserId) {
      await prisma.passwordResetToken.deleteMany({ where: { userId: testUserId } });
      await prisma.user.delete({ where: { id: testUserId } });
      console.log('\n   Cleaned up test user.');
    }
    await prisma.$disconnect();
  }
}

testPasswordReset();
