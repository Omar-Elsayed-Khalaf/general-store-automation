import { BasePage } from './BasePage';

/**
 * ProductsPage - The product listing screen
 */
export class ProductsPage extends BasePage {

    // ========== LOCATORS ==========

    private readonly ADD_TO_CART_SELECTOR = 'android=new UiSelector().text("ADD TO CART")';
    private readonly PRODUCT_NAME_SELECTOR = 'android=new UiSelector().resourceId("com.androidsample.generalstore:id/productName")';

    private get cartIcon() {
        return $('android=new UiSelector().resourceId("com.androidsample.generalstore:id/appbar_btn_cart")');
    }

    private get addToCartButton() {
        return $(this.ADD_TO_CART_SELECTOR);
    }

    // ========== ACTIONS ==========

    async addProductToCartByIndex(index: number): Promise<void> {
        const addToCartButtons = $$(this.ADD_TO_CART_SELECTOR);
        const count = await addToCartButtons.length;

        if (count === 0) {
            throw new Error('No "ADD TO CART" buttons found on the products page');
        }

        if (index >= count) {
            throw new Error(`Product index ${index} is out of range. Only ${count} products visible.`);
        }

        await addToCartButtons[index].click();
    }

    async getProductNameByIndex(index: number): Promise<string> {
        const productNames = $$(this.PRODUCT_NAME_SELECTOR);
        const count = await productNames.length;

        if (index >= count) {
            throw new Error(`Product index ${index} out of range. Only ${count} products visible.`);
        }

        return await productNames[index].getText();
    }

    async goToCart(): Promise<void> {
        await this.cartIcon.click();
    }

    async waitForPageToLoad(): Promise<void> {
        await this.addToCartButton.waitForDisplayed({ timeout: this.timeout });
    }
}
