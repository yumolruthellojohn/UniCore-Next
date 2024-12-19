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

        await driver.findElement(By.name('dept_id')).sendKeys('2');
        await driver.findElement(By.name('room_id')).sendKeys('1');
        await driver.findElement(By.name('rq_prio_level')).sendKeys('Moderate');
        await driver.findElement(By.id('rq_start_date')).sendKeys('03/01/2025');
        await driver.findElement(By.id('rq_end_date')).sendKeys('03/01/2025');
        await driver.findElement(By.id('rq_start_time')).sendKeys('01:00 pm');
        await driver.findElement(By.id('rq_end_time')).sendKeys('04:00 pm');

        const rq_notes = await driver.findElement(By.id('rq_notes'));
        await rq_notes.clear();
        await rq_notes.sendKeys('');

        await driver.findElement(By.css('button[type="submit"]')).click();

        // Verify the input field's validation message
        const validationMessage = await rq_notes.getAttribute('validationMessage');
        expect(validationMessage).toBe('Please fill out this field');
    });

});
