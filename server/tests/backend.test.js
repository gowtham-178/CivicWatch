const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

// Set test environment
process.env.NODE_ENV = 'test';

const app = require('../src/index');
const User = require('../src/models/user');
const Report = require('../src/models/report');

describe('CivicWatch Backend Tests', () => {
  let authToken;
  let userId;
  let reportId;
  let testEmail = `test${Date.now()}@example.com`;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  });

  afterAll(async () => {
    // Cleanup test data
    await User.deleteMany({ email: { $regex: 'test.*@example.com' } });
    await Report.deleteMany({ title: 'Test Report' });
    await mongoose.connection.close();
  });

  // Test 1: User Registration with OTP
  describe('Test 1: User Registration with OTP', () => {
    it('should register a new user and send OTP', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: testEmail,
          password: 'TestPassword123',
          confirmpassword: 'TestPassword123',
          phone: '1234567890'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('OTP sent');
      expect(response.body.email).toBe(testEmail);

      // Verify user was created in database
      const user = await User.findOne({ email: testEmail });
      expect(user).toBeDefined();
      expect(user.isEmailVerified).toBe(false);
      expect(user.emailOtp).toBeDefined();
    });

    it('should reject duplicate email registration', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Another User',
          email: testEmail,
          password: 'TestPassword123',
          confirmpassword: 'TestPassword123',
          phone: '9876543210'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });

    it('should reject mismatched passwords', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User 2',
          email: `test2${Date.now()}@example.com`,
          password: 'TestPassword123',
          confirmpassword: 'DifferentPassword',
          phone: '1234567890'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('do not match');
    });
  });

  // Test 2: OTP Verification and Login
  describe('Test 2: OTP Verification and Login', () => {
    it('should verify OTP and return JWT token', async () => {
      // Get the OTP from database
      const user = await User.findOne({ email: testEmail });
      const otp = user.emailOtp;

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          email: testEmail,
          otp: otp
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.isEmailVerified).toBe(true);

      authToken = response.body.token;
      userId = response.body.user._id;
    });

    it('should reject invalid OTP', async () => {
      const testEmail2 = `test${Date.now() + 1}@example.com`;
      
      // Register new user
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User 3',
          email: testEmail2,
          password: 'TestPassword123',
          confirmpassword: 'TestPassword123',
          phone: '1234567890'
        });

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          email: testEmail2,
          otp: '000000'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid OTP');
    });

    it('should login verified user with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'TestPassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(testEmail);
    });

    it('should reject login with unverified email', async () => {
      const testEmail3 = `test${Date.now() + 2}@example.com`;
      
      // Register but don't verify
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Unverified User',
          email: testEmail3,
          password: 'TestPassword123',
          confirmpassword: 'TestPassword123',
          phone: '1234567890'
        });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail3,
          password: 'TestPassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('verify your email');
    });
  });

  // Test 3: Create and Retrieve Reports
  describe('Test 3: Create and Retrieve Reports', () => {
    it('should create a new report with authenticated user', async () => {
      const response = await request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Report',
          description: 'This is a test report for pothole',
          location: 'Main Street, City Center',
          category: 'Infrastructure',
          priority: 'High'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.title).toBe('Test Report');
      expect(response.body.data.status).toBe('Pending');
      expect(response.body.data.submittedBy._id).toBe(userId);

      reportId = response.body.data._id;
    });

    it('should reject report creation without authentication', async () => {
      const response = await request(app)
        .post('/api/reports')
        .send({
          title: 'Unauthorized Report',
          description: 'This should fail',
          location: 'Some Street',
          category: 'Safety',
          priority: 'Medium'
        });

      expect(response.status).toBe(401);
    });

    it('should retrieve all reports with pagination', async () => {
      const response = await request(app)
        .get('/api/reports?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.docs).toBeDefined();
      expect(Array.isArray(response.body.data.docs)).toBe(true);
      expect(response.body.data.totalDocs).toBeGreaterThanOrEqual(1);
      expect(response.body.data.page).toBe(1);
    });

    it('should retrieve user\'s own reports', async () => {
      const response = await request(app)
        .get('/api/reports/my-reports')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      expect(response.body.data[0].submittedBy._id).toBe(userId);
    });
  });

  // Test 4: Update Report Status and Authorization
  describe('Test 4: Update Report Status and Authorization', () => {
    it('should allow user to update their own report', async () => {
      const response = await request(app)
        .put(`/api/reports/${reportId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Test Report',
          priority: 'Critical'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.report.title).toBe('Updated Test Report');
      expect(response.body.report.priority).toBe('Critical');
    });

    it('should reject update from unauthorized user', async () => {
      // Create another user
      const testEmail4 = `test${Date.now() + 3}@example.com`;
      
      const signupRes = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Another User',
          email: testEmail4,
          password: 'TestPassword123',
          confirmpassword: 'TestPassword123',
          phone: '1234567890'
        });

      const user = await User.findOne({ email: testEmail4 });
      const otpRes = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          email: testEmail4,
          otp: user.emailOtp
        });

      const otherToken = otpRes.body.token;

      const response = await request(app)
        .put(`/api/reports/${reportId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          title: 'Hacked Title'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Not authorized');
    });

    it('should retrieve specific report with details', async () => {
      const response = await request(app)
        .get(`/api/reports/${reportId}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(reportId);
      expect(response.body.title).toBe('Updated Test Report');
      expect(response.body.submittedBy).toBeDefined();
    });

    it('should return 404 for non-existent report', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/reports/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('not found');
    });
  });

  // Test 5: Password Management
  describe('Test 5: Password Management', () => {
    it('should change password with correct current password', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'TestPassword123',
          newPassword: 'NewPassword456',
          confirmPassword: 'NewPassword456'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('successfully');

      // Verify new password works
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'NewPassword456'
        });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.success).toBe(true);
    });

    it('should reject password change with incorrect current password', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'WrongPassword',
          newPassword: 'AnotherPassword789',
          confirmPassword: 'AnotherPassword789'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('incorrect');
    });

    it('should reject password change with mismatched new passwords', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'NewPassword456',
          newPassword: 'Password1',
          confirmPassword: 'Password2'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('do not match');
    });

    it('should retrieve user profile with authentication', async () => {
      const response = await request(app)
        .get('/api/auth/myprofile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(testEmail);
      expect(response.body.data.password).toBeUndefined();
    });

    it('should reject profile access without authentication', async () => {
      const response = await request(app)
        .get('/api/auth/myprofile');

      expect(response.status).toBe(401);
    });
  });
});
