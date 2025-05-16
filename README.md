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

## 🧪 How to Run the Tests

### 1️⃣ Install dependencies:

```bash
npm install

Run all tests:
npx playwright test

Run only a test suite:
Edit .env:

TEST_SUITE=regression
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

