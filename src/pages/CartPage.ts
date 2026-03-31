import { BasePage } from './BasePage';

/**
 * CartPage - The cart/checkout screen
 */
export class CartPage extends BasePage {

    // ========== LOCATORS ==========

    private readonly PRODUCT_NAME_SELECTOR = 'android=new UiSelector().resourceId("com.androidsample.generalstore:id/productName")';

    private get cartProduct() {
        return $(this.PRODUCT_NAME_SELECTOR);
    }

    // ========== ACTIONS ==========

    async getCartProductNames(): Promise<string[]> {
        const names: string[] = [];

        for await (const element of $$(this.PRODUCT_NAME_SELECTOR)) {
            const name = await element.getText();
            names.push(name);
        }

        return names;
    }

    async isProductInCart(productName: string): Promise<boolean> {
        const cartProducts = await this.getCartProductNames();
        return cartProducts.includes(productName);
    }

    async getCartItemCount(): Promise<number> {
        const products = await this.getCartProductNames();
        return products.length;
    }

    async waitForPageToLoad(): Promise<void> {
        await this.cartProduct.waitForDisplayed({ timeout: this.timeout });
    }
}
