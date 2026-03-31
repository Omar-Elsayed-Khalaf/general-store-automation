import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { UserData } from '../types/types';
import testData from '../data/testData.json';

// Runtime type guard — catches malformed testData.json entries at test start
function isValidUser(obj: unknown): obj is UserData {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof (obj as UserData).name === 'string' &&
        typeof (obj as UserData).country === 'string' &&
        ['Male', 'Female'].includes((obj as UserData).gender)
    );
}

const users = (testData as unknown[]).filter(isValidUser);

if (users.length === 0) {
    throw new Error('testData.json contains no valid UserData entries');
}

// Each user gets its own top-level describe — fully independent suites
for (const user of users) {
    describe(`General Store - Shopping Flow for ${user.name} (${user.gender})`, () => {

        let homePage: HomePage;
        let productsPage: ProductsPage;
        let cartPage: CartPage;

        before(async () => {
            homePage = new HomePage();
            productsPage = new ProductsPage();
            cartPage = new CartPage();

            await driver.terminateApp('com.androidsample.generalstore');
            await driver.activateApp('com.androidsample.generalstore');
            await homePage.waitForPageToLoad();
        });

        it(`should fill the form with name "${user.name}" and country "${user.country}"`, async () => {
            await homePage.selectCountry(user.country);
            await homePage.enterName(user.name);
            await homePage.selectGender(user.gender);
        });

        it('should navigate to products page', async () => {
            await homePage.clickLetsShop();
            await productsPage.waitForPageToLoad();
        });

        it('should add a product to the cart and verify it appears', async () => {
            const selectedProductName = await productsPage.getProductNameByIndex(0);
            await productsPage.addProductToCartByIndex(0);

            await productsPage.goToCart();
            await cartPage.waitForPageToLoad();

            expect(selectedProductName).toBeTruthy();
            const isInCart = await cartPage.isProductInCart(selectedProductName);
            expect(isInCart).toBe(true);
        });
    });
}
