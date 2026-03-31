import { test, expect } from '@playwright/test';


const OHR_USERNAME = process.env.OHR_USERNAME ?? 'Admin';
const OHR_PASSWORD = process.env.OHR_PASSWORD ?? 'admin123';

async function extractCsrfToken(html: string): Promise<string> {
    const match = html.match(/:token="&quot;(.+?)&quot;"/);
    if (!match) {
        throw new Error('Could not extract CSRF token from login page');
    }
    return match[1];
}

test.describe('OrangeHRM API Tests', () => {

    // Each test is independent — creates and cleans up its own data

    test('should add and then delete a candidate via API', async ({ request }) => {
        // Step 1: Get CSRF token from login page
        const loginPage = await request.get('/web/index.php/auth/login');
        expect(loginPage.ok()).toBeTruthy();
        const loginHtml = await loginPage.text();
        const csrfToken = await extractCsrfToken(loginHtml);

        // Step 2: Authenticate (follows redirect — successful login lands on /dashboard)
        const loginResponse = await request.post('/web/index.php/auth/validate', {
            form: {
                '_token': csrfToken,
                'username': OHR_USERNAME,
                'password': OHR_PASSWORD,
            },
        });
        expect(loginResponse.url()).toContain('dashboard');

        // Step 3: Create a candidate
        const candidateData = {
            firstName: 'Test',
            middleName: '',
            lastName: 'Candidate',
            email: `test.candidate.${Date.now()}@example.com`,
            contactNumber: '1234567890',
            vacancyId: null,
            consentToKeepData: false,
        };

        const createResponse = await request.post('/web/index.php/api/v2/recruitment/candidates', {
            data: candidateData,
        });
        expect(createResponse.status()).toBe(200);

        const responseBody = await createResponse.json();
        const candidateId = responseBody.data?.id;
        expect(candidateId).toBeTruthy();

        // Step 4: Delete the candidate
        const deleteResponse = await request.delete('/web/index.php/api/v2/recruitment/candidates', {
            data: {
                ids: [candidateId],
            },
        });
        expect(deleteResponse.status()).toBe(200);

        // Step 5: Verify deletion — fetching the candidate should fail
        const verifyResponse = await request.get(`/web/index.php/api/v2/recruitment/candidates/${candidateId}`);
        expect(verifyResponse.ok()).toBeFalsy();
    });
});
