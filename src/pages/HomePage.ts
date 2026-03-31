import { BasePage } from './BasePage';

/**
 * HomePage - The first screen of the General Store app
 */
export class HomePage extends BasePage {

    // ========== LOCATORS ==========

    private get countryDropdown() {
        return $('android=new UiSelector().resourceId("com.androidsample.generalstore:id/spinnerCountry")');
    }

    private get nameField() {
        return $('android=new UiSelector().resourceId("com.androidsample.generalstore:id/nameField")');
    }

    private get maleRadio() {
        return $('android=new UiSelector().resourceId("com.androidsample.generalstore:id/radioMale")');
    }

    private get femaleRadio() {
        return $('android=new UiSelector().resourceId("com.androidsample.generalstore:id/radioFemale")');
    }

    private get letsShopButton() {
        return $('android=new UiSelector().resourceId("com.androidsample.generalstore:id/btnLetsShop")');
    }

    // ========== ACTIONS ==========

    async selectCountry(country: string): Promise<void> {
        await this.countryDropdown.click();

        const safeCountry = country.replace(/"/g, '\\"');
        const countrySelector = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${safeCountry}"))`;
        await $(countrySelector).click();
    }

    async enterName(name: string): Promise<void> {
        await this.nameField.waitForDisplayed({ timeout: this.timeout });
        await this.nameField.setValue(name);
        const actual = await this.nameField.getText();
        if (actual !== name) {
            throw new Error(`enterName failed: expected "${name}" but field contains "${actual}"`);
        }
    }

    async selectGender(gender: 'Male' | 'Female'): Promise<void> {
        if (gender === 'Male') {
            await this.maleRadio.click();
        } else {
            await this.femaleRadio.click();
        }
    }

    async clickLetsShop(): Promise<void> {
        await this.letsShopButton.click();
    }

    async waitForPageToLoad(): Promise<void> {
        await this.nameField.waitForDisplayed({ timeout: this.timeout });
    }
}
