import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

describe('Login Tests', () => {
    let driver: WebDriver;

    beforeAll(async () => {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options())
            .build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('Submit Facility Reservation Request with missing fields (Request Notes)', async () => {
        // Navigate to login page
        await driver.get('http://localhost:3000/auth/login');

        // Find and fill in the login form
        await driver.findElement(By.name('user_idnum')).sendKeys('19099456');
        await driver.findElement(By.name('user_password')).sendKeys('glenn');

        // Submit the form
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for navigation to complete and verify redirect
        await driver.wait(until.urlIs('http://localhost:3000/'), 5000);

        await driver.get('http://localhost:3000/technical/requests/new/reserve-facility');

        // Wait for page to be fully loaded
        await driver.wait(until.elementIsVisible(await driver.findElement(By.css('[data-testid="dept-select-trigger"]'))));
        await driver.wait(until.elementIsVisible(await driver.findElement(By.css('[data-testid="facility-select-trigger"]'))));
        await driver.wait(until.elementIsVisible(await driver.findElement(By.css('[data-testid="priority-select-trigger"]'))));

        // For department selection
        const deptTrigger = await driver.findElement(By.css('[data-testid="dept-select-trigger"]'));
        await driver.executeScript("arguments[0].click();", deptTrigger);
        await driver.wait(until.elementLocated(By.css('[value="2"]')));
        await driver.findElement(By.css('[value="2"]')).click();

        // For facility selection
        const facilityTrigger = await driver.findElement(By.css('[data-testid="facility-select-trigger"]'));
        await driver.executeScript("arguments[0].click();", facilityTrigger);
        await driver.wait(until.elementLocated(By.css('[value="1"]')));
        await driver.findElement(By.css('[value="1"]')).click();

        // For priority level
        const priorityTrigger = await driver.findElement(By.css('[data-testid="priority-select-trigger"]'));
        await driver.executeScript("arguments[0].click();", priorityTrigger);
        await driver.wait(until.elementLocated(By.css('[value="Moderate"]')));
        await driver.findElement(By.css('[value="Moderate"]')).click();

        const rq_notes = await driver.findElement(By.id('rq_notes'));
        await rq_notes.clear();
        await rq_notes.sendKeys('');

        await driver.findElement(By.css('button[type="submit"]')).click();

        // Verify the input field's validation message
        const validationMessage = await rq_notes.getAttribute('validationMessage');
        expect(validationMessage).toBe('Please fill out this field.');
    });

});
