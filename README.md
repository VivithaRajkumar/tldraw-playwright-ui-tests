# TLDraw Playwright UI Automation Framework

This project automates UI regression and sanity test cases for [https://makereal.tldraw.com](https://makereal.tldraw.com) using Playwright.

## ✅ Features

- Headless browser support
- Video capture on test failure
- Screenshot comparison for visual diffs
- Organized test suites: `regression/`, `sanity/`
- Supports selective test case execution via `.env`

---

## 📁 Project Structure\
tldraw-playwright-ui-tests/
│__screenshots
|__test-results
├── tests/
│ ├── regression/
│ │ ├── tc01_draw_straight_line.spec.ts
│ │ └── tc02_draw_angled_line.spec.ts
│ ├── sanity/
│ │ ├── tc03_zoom_in.spec.ts
│ │ └── tc04_zoom_out.spec.ts
│
├── utils/
│ ├── screenshotUtils.ts
│
├── .env # Contains TC= and TEST_SUITE=
├── playwright.config.ts
├── README.md
└── package.json


tests/: Contains the main test scripts.
utils/: Houses utility functions and helpers.
playwright-report/: Stores generated test reports.
test-results/: Includes artifacts like screenshots and videos from test runs.
playwright.config.ts: Configuration file for Playwright settings.
.env: Environment variables for customizing test execution


## 🧪 How to Run the Tests

### 1️⃣ Install dependencies:

```bash
npm install

List all the tests selected for execution
npx playwright test --list

Run all tests:
npx playwright test

Run only a test suite:
Edit .env:

TEST_SUITE=regression or sanity
Then run:
npm run test:filtered



🧼 Clean Results
To clear screenshots/videos before a fresh run:
npm run clean

📊 Test Report
After the test run, view the Playwright report:

npx playwright show-report

💡 Notes
Videos are saved for failed tests only.
Screenshots are auto-compared pixel-by-pixel for visual validation.

