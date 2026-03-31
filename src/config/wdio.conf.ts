import path from 'path';
import fs from 'fs';

const screenshotsDir = path.resolve('./screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

export const config: WebdriverIO.Config = {
    // ==========================
    // Runner & Framework
    // ==========================
    runner: 'local',
    framework: 'mocha',
    tsConfigPath: './tsconfig.json',

    // ==========================
    // Specs (test files)
    // ==========================
    specs: ['../tests/**/*.spec.ts'],

    // ==========================
    // Appium Capabilities
    // ==========================
    maxInstances: 1,
    capabilities: [{
        'platformName': 'Android',
        'appium:deviceName': process.env.DEVICE_NAME ?? 'emulator-5554',
        'appium:platformVersion': process.env.PLATFORM_VERSION ?? '17',
        'appium:automationName': 'UiAutomator2',
        'appium:app': path.resolve(process.env.APP_PATH ?? './app/General-Store.apk'),
        'appium:appWaitActivity': '*',
        'appium:noReset': false,
        'appium:autoGrantPermissions': true,
    }],

    // ==========================
    // Appium Server
    // ==========================
    hostname: 'localhost',
    port: 4723,

    // ==========================
    // Timeouts
    // ==========================
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    // ==========================
    // Mocha Options
    // ==========================
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },

    // ==========================
    // Reporters
    // ==========================
    reporters: [
        'spec',
        ['allure', {
            outputDir: './allure-results',
            disableWebdriverScreenshotsReporting: false,
            disableWebdriverStepsReporting: false,
        }],
    ],

    // ==========================
    // Hooks
    // ==========================
    afterTest: async function (test: { title: string }, _context: unknown, { passed }: { passed: boolean }) {
        if (!passed) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${test.title.replace(/\s+/g, '_')}-${timestamp}.png`;
            await driver.saveScreenshot(path.join(screenshotsDir, filename));
        }
    },
};
