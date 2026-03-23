# Quick Reference: Commands to Screenshot

## Git Workflow Commands (Copy & Paste)

### Screenshot 1: Create Branch
```bash
git checkout -b feature/add-backend-tests
```

### Screenshot 2: Check Status
```bash
git status
```

### Screenshot 3: Stage Changes
```bash
git add .
```

### Screenshot 4: Commit Changes
```bash
git commit -m "Add comprehensive backend test suite with 20 test cases

- Test 1: User Registration with OTP (3 cases)
- Test 2: OTP Verification and Login (4 cases)
- Test 3: Create and Retrieve Reports (4 cases)
- Test 4: Update Report and Authorization (4 cases)
- Test 5: Password Management (5 cases)"
```

### Screenshot 5: View Commit Log
```bash
git log --oneline -5
```

### Screenshot 6: Push to Branch
```bash
git push origin feature/add-backend-tests
```

### Screenshot 7: View All Branches
```bash
git branch -a
```

---

## Unit Testing Commands (Copy & Paste)

### Screenshot 1: Navigate to Server
```bash
cd server
```

### Screenshot 2: Install Dependencies
```bash
npm install
```

### Screenshot 3: Run All Tests
```bash
npm test
```

### Screenshot 4: Run Tests with Coverage
```bash
npm test -- --coverage
```

### Screenshot 5: Run Specific Test Suite
```bash
npm test -- --testNamePattern="Test 1"
```

### Screenshot 6: Run Tests in Watch Mode
```bash
npm run test:watch
```

---

## Windows Screenshot Shortcuts

| Action | Shortcut |
|--------|----------|
| Full Screen | `Print Screen` |
| Snipping Tool | `Windows + Shift + S` |
| Screenshot to Clipboard | `Alt + Print Screen` |

## File Naming Pattern

```
01-create-branch.png
02-stage-changes.png
03-commit-changes.png
04-commit-log.png
05-push-branch.png
06-branch-status.png

01-install-dependencies.png
02-run-all-tests.png
03-test-results-success.png
04-test-coverage.png
05-specific-test-suite.png
```

## Save Location

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

## Step-by-Step Execution

### Part 1: Git Workflow (7 screenshots)
1. Run: `git checkout -b feature/add-backend-tests` → Screenshot
2. Run: `git status` → Screenshot
3. Run: `git add .` → Screenshot
4. Run: `git commit -m "..."` → Screenshot
5. Run: `git log --oneline -5` → Screenshot
6. Run: `git push origin feature/add-backend-tests` → Screenshot
7. Run: `git branch -a` → Screenshot

### Part 2: Unit Testing (5 screenshots)
1. Run: `cd server` → Screenshot
2. Run: `npm install` → Screenshot
3. Run: `npm test` → Screenshot
4. Run: `npm test -- --coverage` → Screenshot
5. Run: `npm test -- --testNamePattern="Test 1"` → Screenshot

---

## What Each Screenshot Should Show

### Git Screenshots
- ✅ Terminal window with command
- ✅ Command output/result
- ✅ Branch name (if applicable)
- ✅ File changes or commit hash
- ✅ Status confirmation

### Testing Screenshots
- ✅ Terminal window with command
- ✅ Test execution output
- ✅ Test names and results (✓ or ✗)
- ✅ Summary line (X passed, X total)
- ✅ Execution time

---

## Tips

1. **Before each screenshot:**
   - Clear terminal: `clear` (Mac/Linux) or `cls` (Windows)
   - Make terminal full screen
   - Increase font size if needed

2. **After taking screenshot:**
   - Save with correct filename
   - Save to correct folder
   - Verify image quality

3. **For better visibility:**
   - Use light terminal theme
   - Use monospace font (Courier, Consolas)
   - Maximize terminal window

---

## Verification Checklist

- [ ] All 7 git workflow screenshots taken
- [ ] All 5 unit testing screenshots taken
- [ ] Files named correctly (01-, 02-, etc.)
- [ ] Files in correct folders
- [ ] All screenshots show clear terminal output
- [ ] No sensitive information visible
- [ ] Image quality is good (readable text)
- [ ] Ready to add to documentation
