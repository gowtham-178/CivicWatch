# Backend Test Suite

This test suite covers five critical areas of the CivicWatch backend API.

## Setup

### 1. Install Testing Dependencies
```bash
cd server
npm install --save-dev jest supertest
```

### 2. Update package.json
Add the following to your `server/package.json`:
```json
{
  "scripts": {
    "test": "jest --detectOpenHandles --forceExit",
    "test:watch": "jest --watch"
  },
  "jest": {
    "testEnvironment": "node",
    "testTimeout": 30000,
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/index.js"
    ]
  }
}
```

### 3. Environment Setup
Ensure your `server/.env` has a test database URI or the tests will use your main database. Consider creating a separate test database:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/civicwatch_test
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run specific test suite
```bash
npm test -- --testNamePattern="Test 1"
```

## Test Coverage

### Test 1: User Registration with OTP (3 cases)
- ✅ Register new user and send OTP
- ✅ Reject duplicate email
- ✅ Reject mismatched passwords

### Test 2: OTP Verification and Login (4 cases)
- ✅ Verify OTP and return JWT token
- ✅ Reject invalid OTP
- ✅ Login with verified email
- ✅ Reject login with unverified email

### Test 3: Create and Retrieve Reports (4 cases)
- ✅ Create report with authenticated user
- ✅ Reject unauthenticated report creation
- ✅ Retrieve all reports with pagination
- ✅ Retrieve user's own reports

### Test 4: Update Report and Authorization (4 cases)
- ✅ Allow user to update own report
- ✅ Reject unauthorized updates
- ✅ Retrieve specific report details
- ✅ Return 404 for non-existent report

### Test 5: Password Management (5 cases)
- ✅ Change password with correct current password
- ✅ Reject password change with wrong current password
- ✅ Reject mismatched new passwords
- ✅ Retrieve user profile with auth
- ✅ Reject profile access without auth

## Total: 20 Test Cases

## Notes

- Tests use unique email addresses with timestamps to avoid conflicts
- Database cleanup happens after all tests complete
- Each test is isolated and can run independently
- Tests verify both success and failure scenarios
- Authorization and authentication are thoroughly tested
