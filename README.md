# General Store Mobile Automation - Technical Assessment

Automation QC Engineer assessment covering mobile E2E testing (Appium) and API automation (Playwright).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript |
| Mobile Automation | Appium 2.x + UiAutomator2 |
| Client Library | WebDriverIO v9 |
| Test Runner | Mocha (BDD) |
| API Automation | Playwright |
| Reporting | Allure + Spec |
| Design Pattern | Page Object Model |
| Test Data | Data-Driven (JSON) |

## Project Structure

```
general-store-automation/
├── app/
│   └── General-Store.apk
├── src/
│   ├── config/
│   │   └── wdio.conf.ts            # WebDriverIO + Appium configuration
│   ├── pages/                       # Page Object Model classes
│   │   ├── BasePage.ts              # Abstract base with shared utilities
│   │   ├── HomePage.ts              # Home screen (country, name, gender)
│   │   ├── ProductsPage.ts          # Product listing screen
│   │   └── CartPage.ts              # Cart/checkout screen
│   ├── data/
│   │   └── testData.json            # Test data for data-driven testing
│   ├── types/
│   │   └── types.ts                 # TypeScript interfaces
│   ├── tests/
│   │   └── shoppingFlow.spec.ts     # Main task: E2E shopping flow
│   └── api-tests/
│       ├── playwright.config.ts     # Playwright config (API-only, no browser)
│       └── orangehrm.spec.ts        # Bonus task: OrangeHRM API tests
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

1. **Node.js** v18+
2. **Java JDK** v11+ (required by Appium)
3. **Android Studio** with Android SDK and an emulator (or a real device)
4. Environment variables set:
   - `ANDROID_HOME` pointing to the Android SDK
   - `JAVA_HOME` pointing to the JDK
   - Both added to system `PATH`

## Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd general-store-automation

# 2. Install dependencies
npm install

# 3. Install Appium globally and the UiAutomator2 driver
npm install -g appium
appium driver install uiautomator2

# 4. Place General-Store.apk in the /app folder (already included)

# 5. Start an Android emulator or connect a real device
adb devices   # verify the device is visible

# 6. Start Appium server
appium
```

## Running Tests

```bash
# Mobile tests (main task)
npm run test:mobile

# API tests (bonus task)
npm run test:api

# All tests
npm run test:all
```

## Environment Variables

All optional — defaults work out of the box for a standard local setup.

| Variable | Default | Description |
|----------|---------|-------------|
| `DEVICE_NAME` | `emulator-5554` | Android device/emulator name |
| `PLATFORM_VERSION` | `17` | Android OS version |
| `APP_PATH` | `./app/General-Store.apk` | Path to the APK |
| `OHR_BASE_URL` | `https://opensource-demo.orangehrmlive.com` | OrangeHRM base URL |
| `OHR_USERNAME` | `Admin` | OrangeHRM login username |
| `OHR_PASSWORD` | `admin123` | OrangeHRM login password |

## Test Details

### Main Task - Mobile E2E Shopping Flow

Tests the General Store Android app end-to-end:
1. Fill the form (country, name, gender) on the home screen
2. Navigate to the products page
3. Add a product to the cart and verify it appears

Data-driven: the same flow runs for each user entry in `testData.json`.

### Bonus Task - OrangeHRM API Automation

Tests the OrangeHRM recruitment module via REST APIs:
1. Authenticate (CSRF token extraction + cookie-based session)
2. Create a candidate via `POST /api/v2/recruitment/candidates`
3. Delete the candidate via `DELETE /api/v2/recruitment/candidates`
4. Verify deletion via `GET` returns a non-200 status

### Reporting

- **Spec reporter** outputs results to the terminal
- **Allure reporter** generates detailed reports in `allure-results/`
- **Failure screenshots** are saved automatically to `screenshots/`

To view the Allure report:
```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

## Design Decisions

- **Abstract BasePage**: Enforces `waitForPageToLoad()` on every page object and provides shared utility methods (`tap`, `type`, `getText`, `isDisplayed`).
- **Data-Driven Testing**: Test data externalized in `testData.json` with runtime type validation. Each user dataset runs as an independent test suite.
- **Selector Safety**: Country input is sanitized to prevent UiSelector injection. Selector strings used in multiple places are extracted to `readonly` constants.
- **Post-Action Verification**: `enterName()` verifies the field value after `setValue()` to catch silent input failures on Android.
- **Independent API Tests**: Each API test authenticates, creates data, cleans up, and verifies — no shared state between tests.
- **Environment-Driven Config**: Device details and credentials are configurable via environment variables with sensible defaults.

## Author

Omar Khalaf
