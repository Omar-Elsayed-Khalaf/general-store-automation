import { defineConfig } from '@playwright/test';

/**
 * Playwright config - ONLY for API testing
 * No browser is launched - we're just making HTTP requests
 */
export default defineConfig({
    testDir: './',
    timeout: 30000,
    use: {
        baseURL: process.env.OHR_BASE_URL ?? 'https://opensource-demo.orangehrmlive.com',
        extraHTTPHeaders: {
            'Accept': 'application/json',
        },
    },
});
