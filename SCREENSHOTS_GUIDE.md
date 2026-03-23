# Screenshots Guide: Git Commits & Unit Testing

This guide shows you how to capture and organize screenshots of your git workflow and testing process.

## Part 1: Git Commit & Branch Screenshots

### Step 1: Create a Feature Branch
```bash
git checkout -b feature/add-backend-tests
```

**Screenshot to capture:**
- Open terminal/command prompt
- Run the command above
- Take screenshot showing the branch creation

### Step 2: Stage Your Changes
```bash
git add .
```

**Screenshot to capture:**
- Show the git add command in terminal
- Verify files are staged

### Step 3: Commit Your Changes
```bash
git commit -m "Add comprehensive backend test suite with 20 test cases"
```

**Screenshot to capture:**
- Show the commit message in terminal
- Include the commit hash and file changes

### Step 4: View Commit Log
```bash
git log --oneline -5
```

**Screenshot to capture:**
- Show your new commit in the log
- Display the commit hash and message

### Step 5: Push to Branch
```bash
git push origin feature/add-backend-tests
```

**Screenshot to capture:**
- Show the push command and confirmation
- Display the branch name being pushed

### Step 6: View Branch Status
```bash
git branch -a
```

**Screenshot to capture:**
- Show all branches with your new feature branch highlighted

---

## Part 2: Unit Testing Screenshots

### Step 1: Install Dependencies
```bash
cd server
npm install
```

**Screenshot to capture:**
- Show the npm install output
- Display "added X packages" confirmation

### Step 2: Run All Tests
```bash
npm test
```

**Screenshot to capture:**
- Show the test execution starting
- Display the test suite name and test count

### Step 3: Test Results - Success
**Screenshot to capture:**
- Show passing tests with ✓ marks
- Display test summary (e.g., "20 passed, 20 total")
- Show execution time

### Step 4: Test Results - Coverage
```bash
npm test -- --coverage
```

**Screenshot to capture:**
- Show code coverage report
- Display coverage percentages for different files

### Step 5: Run Specific Test Suite
```bash
npm test -- --testNamePattern="Test 1"
```

**Screenshot to capture:**
- Show running a specific test suite
- Display only those tests running

---

## How to Take Screenshots

### Windows:
1. **Print Screen Method:**
   - Press `Print Screen` key
   - Paste in Paint or image editor
   - Save as PNG

2. **Snipping Tool:**
   - Press `Windows + Shift + S`
   - Select area to capture
   - Save the screenshot

3. **Terminal Screenshot:**
   - Right-click terminal window
   - Select "Copy" to copy visible text
   - Or use Snipping Tool for visual capture

### Mac:
1. **Full Screenshot:**
   - Press `Cmd + Shift + 3`
   - Screenshot saved to Desktop

2. **Partial Screenshot:**
   - Press `Cmd + Shift + 4`
   - Drag to select area

### Linux:
1. **Using gnome-screenshot:**
   ```bash
   gnome-screenshot
   ```

2. **Using scrot:**
   ```bash
   scrot screenshot.png
   ```

---

## Organizing Screenshots

### Folder Structure:
```
CivicWatch/
├── screenshots/
│   ├── git-workflow/
│   │   ├── 01-create-branch.png
│   │   ├── 02-stage-changes.png
│   │   ├── 03-commit-changes.png
│   │   ├── 04-commit-log.png
│   │   ├── 05-push-branch.png
│   │   └── 06-branch-status.png
│   └── unit-testing/
│       ├── 01-install-dependencies.png
│       ├── 02-run-all-tests.png
│       ├── 03-test-results-success.png
│       ├── 04-test-coverage.png
│       └── 05-specific-test-suite.png
```

### Create Folders:
```bash
mkdir -p screenshots/git-workflow
mkdir -p screenshots/unit-testing
```

---

## Complete Git Workflow Commands

### Full workflow to capture:

```bash
# 1. Create and switch to new branch
git checkout -b feature/add-backend-tests

# 2. Check status
git status

# 3. Stage all changes
git add .

# 4. Commit with message
git commit -m "Add comprehensive backend test suite with 20 test cases

- Test 1: User Registration with OTP (3 cases)
- Test 2: OTP Verification and Login (4 cases)
- Test 3: Create and Retrieve Reports (4 cases)
- Test 4: Update Report and Authorization (4 cases)
- Test 5: Password Management (5 cases)"

# 5. View commit details
git log --oneline -5

# 6. Push to remote
git push origin feature/add-backend-tests

# 7. View all branches
git branch -a
```

---

## Complete Testing Commands

### Full testing workflow to capture:

```bash
# 1. Navigate to server directory
cd server

# 2. Install dependencies
npm install

# 3. Run all tests
npm test

# 4. Run tests with coverage
npm test -- --coverage

# 5. Run specific test suite
npm test -- --testNamePattern="Test 1"

# 6. Run tests in watch mode
npm run test:watch
```

---

## Screenshot Naming Convention

Use this naming convention for consistency:

**Git Workflow:**
- `01-create-branch.png`
- `02-stage-changes.png`
- `03-commit-changes.png`
- `04-commit-log.png`
- `05-push-branch.png`
- `06-branch-status.png`

**Unit Testing:**
- `01-install-dependencies.png`
- `02-run-all-tests.png`
- `03-test-results-success.png`
- `04-test-coverage.png`
- `05-specific-test-suite.png`

---

## What to Show in Each Screenshot

### Git Commit Screenshots:
- ✅ Full terminal window with command and output
- ✅ Branch name clearly visible
- ✅ Commit hash and message
- ✅ File changes count
- ✅ Timestamp (if visible)

### Testing Screenshots:
- ✅ Full terminal window with command
- ✅ Test suite name and count
- ✅ Individual test results with ✓ or ✗
- ✅ Test execution time
- ✅ Summary line (e.g., "20 passed, 20 total")
- ✅ Coverage percentages (if applicable)

---

## Tips for Better Screenshots

1. **Maximize Terminal Window:**
   - Make terminal full screen for better visibility
   - Use larger font size if needed

2. **Clear Terminal Before Screenshot:**
   ```bash
   clear  # On Mac/Linux
   cls    # On Windows
   ```

3. **Highlight Important Parts:**
   - Use image editor to circle or highlight key information
   - Add arrows pointing to important details

4. **Include Context:**
   - Show the current directory in prompt
   - Display branch name in terminal title

5. **Consistent Styling:**
   - Use same terminal theme for all screenshots
   - Keep same font and size throughout

---

## Creating a Documentation File

Create `TESTING_EVIDENCE.md` to document your screenshots:

```markdown
# Testing Evidence & Git Workflow

## Git Workflow Screenshots

### 1. Create Feature Branch
![Create Branch](screenshots/git-workflow/01-create-branch.png)
- Command: `git checkout -b feature/add-backend-tests`
- Status: Branch created successfully

### 2. Stage Changes
![Stage Changes](screenshots/git-workflow/02-stage-changes.png)
- Command: `git add .`
- Files staged: 3 files

### 3. Commit Changes
![Commit Changes](screenshots/git-workflow/03-commit-changes.png)
- Command: `git commit -m "Add comprehensive backend test suite..."`
- Commit Hash: abc1234

### 4. Commit Log
![Commit Log](screenshots/git-workflow/04-commit-log.png)
- Shows latest commits
- New commit visible at top

### 5. Push to Branch
![Push Branch](screenshots/git-workflow/05-push-branch.png)
- Command: `git push origin feature/add-backend-tests`
- Status: Successfully pushed

### 6. Branch Status
![Branch Status](screenshots/git-workflow/06-branch-status.png)
- Command: `git branch -a`
- Shows feature branch created

## Unit Testing Screenshots

### 1. Install Dependencies
![Install Dependencies](screenshots/unit-testing/01-install-dependencies.png)
- Command: `npm install`
- Result: 248 packages added

### 2. Run All Tests
![Run Tests](screenshots/unit-testing/02-run-all-tests.png)
- Command: `npm test`
- Tests: 20 total

### 3. Test Results
![Test Results](screenshots/unit-testing/03-test-results-success.png)
- Status: All tests passed ✓
- Summary: 20 passed, 20 total
- Time: ~21 seconds

### 4. Test Coverage
![Test Coverage](screenshots/unit-testing/04-test-coverage.png)
- Command: `npm test -- --coverage`
- Coverage report displayed

### 5. Specific Test Suite
![Specific Tests](screenshots/unit-testing/05-specific-test-suite.png)
- Command: `npm test -- --testNamePattern="Test 1"`
- Tests: 3 passed (Registration tests)
```

---

## Final Checklist

- [ ] Created screenshots folder structure
- [ ] Captured git branch creation
- [ ] Captured git commit with message
- [ ] Captured git push to branch
- [ ] Captured npm install output
- [ ] Captured npm test execution
- [ ] Captured test results (all passed)
- [ ] Captured test coverage report
- [ ] Named all files consistently
- [ ] Created documentation file
- [ ] Organized all screenshots in folders
