/**
 * BasePage - Parent class for all Page Objects
 * Contains shared configuration and reusable methods that ALL pages need.
 */
export abstract class BasePage {

    protected readonly timeout: number = 10000;

    /**
     * Each page must define how to verify it has loaded.
     */
    abstract waitForPageToLoad(): Promise<void>;

    /**
     * Wait for an element to be displayed, then tap/click it
     */
    async tap(selector: string): Promise<void> {
        const element = $(selector);
        await element.waitForDisplayed({ timeout: this.timeout });
        await element.click();
    }

    /**
     * Wait for an element, then type text into it
     */
    async type(selector: string, text: string): Promise<void> {
        const element = $(selector);
        await element.waitForDisplayed({ timeout: this.timeout });
        await element.setValue(text);
    }

    /**
     * Wait for an element and return its text content
     */
    async getText(selector: string): Promise<string> {
        const element = $(selector);
        await element.waitForDisplayed({ timeout: this.timeout });
        return await element.getText();
    }

    /**
     * Check if an element is displayed on screen
     */
    async isDisplayed(selector: string): Promise<boolean> {
        const element = $(selector);
        return await element.isDisplayed();
    }
}
