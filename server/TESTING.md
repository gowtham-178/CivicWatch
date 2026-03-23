# Quick Start: Running Backend Tests

## Step 1: Install Dependencies
Open terminal in the `server` directory and run:
```bash
npm install
```

This will install Jest and Supertest along with other dependencies.

## Step 2: Verify .env File
Make sure your `server/.env` file has:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

**Important**: Tests will use your MongoDB database. Consider using a test database URI to avoid affecting production data.

## Step 3: Run Tests

### Option A: Run All Tests
```bash
npm test
```

### Option B: Run Tests in Watch Mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### Option C: Run Specific Test Suite
```bash
npm test -- --testNamePattern="Test 1"
npm test -- --testNamePattern="Test 2"
npm test -- --testNamePattern="Test 3"
npm test -- --testNamePattern="Test 4"
npm test -- --testNamePattern="Test 5"
```

### Option D: Run with Coverage Report
```bash
npm test -- --coverage
```

## Expected Output

When tests run successfully, you'll see:
```
PASS  tests/backend.test.js
  CivicWatch Backend Tests
    Test 1: User Registration with OTP
      ✓ should register a new user and send OTP (XXms)
      ✓ should reject duplicate email registration (XXms)
      ✓ should reject mismatched passwords (XXms)
    Test 2: OTP Verification and Login
      ✓ should verify OTP and return JWT token (XXms)
      ✓ should reject invalid OTP (XXms)
      ✓ should login verified user with correct credentials (XXms)
      ✓ should reject login with unverified email (XXms)
    Test 3: Create and Retrieve Reports
      ✓ should create a new report with authenticated user (XXms)
      ✓ should reject report creation without authentication (XXms)
      ✓ should retrieve all reports with pagination (XXms)
      ✓ should retrieve user's own reports (XXms)
    Test 4: Update Report Status and Authorization
      ✓ should allow user to update their own report (XXms)
      ✓ should reject update from unauthorized user (XXms)
      ✓ should retrieve specific report with details (XXms)
      ✓ should return 404 for non-existent report (XXms)
    Test 5: Password Management
      ✓ should change password with correct current password (XXms)
      ✓ should reject password change with incorrect current password (XXms)
      ✓ should reject password change with mismatched new passwords (XXms)
      ✓ should retrieve user profile with authentication (XXms)
      ✓ should reject profile access without authentication (XXms)

Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
```

## Troubleshooting

### Tests Timeout
If tests timeout, increase the timeout in `server/package.json`:
```json
"jest": {
  "testTimeout": 60000
}
```

### MongoDB Connection Error
- Verify your `MONGODB_URI` in `.env` is correct
- Ensure MongoDB is running (if using local MongoDB)
- Check your MongoDB Atlas connection string and IP whitelist

### Email Sending Errors
- Tests don't require actual email sending to work
- If you see email errors, they won't fail the tests
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env` if needed

### Port Already in Use
If port 5000 is in use:
- Change `PORT` in `.env` to a different port
- Or kill the process using port 5000

## Test Files Location
- Test file: `server/tests/backend.test.js`
- Test documentation: `server/tests/README.md`

## What Gets Tested

✅ User registration and OTP verification
✅ Email verification flow
✅ User login and JWT authentication
✅ Report creation with authorization
✅ Report retrieval and filtering
✅ Report updates with permission checks
✅ Password management
✅ User profile access
✅ Error handling and validation

Total: 20 test cases covering all critical backend functionality
