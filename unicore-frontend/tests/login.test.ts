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

    test('Login with no ID number and password', async () => {
        await driver.get('http://localhost:3000/auth/login');

        await driver.findElement(By.name('user_idnum')).sendKeys('');
        await driver.findElement(By.name('user_password')).sendKeys('');

        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for error message to appear
        const errorMessage1 = await driver.wait(
            until.elementLocated(By.xpath("//*[@id=':R1l7rrrcq:-form-item-message']")),
            5000
        );

        const errorText1 = await errorMessage1.getText();
        expect(errorText1).toContain('ID Number is required');

        const errorMessage2 = await driver.wait(
            until.elementLocated(By.xpath("//*[@id=':R2l7rrrcq:-form-item-message']")),
            5000
        );

        const errorText2 = await errorMessage2.getText();
        expect(errorText2).toContain('Password is required');
    });

    test('Login with missing ID number', async () => {
        await driver.get('http://localhost:3000/auth/login');

        await driver.findElement(By.name('user_idnum')).sendKeys('');
        await driver.findElement(By.name('user_password')).sendKeys('glenn');

        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for error message to appear
        const errorMessage1 = await driver.wait(
            until.elementLocated(By.xpath("//*[@id=':R1l7rrrcq:-form-item-message']")),
            5000
        );

        const errorText1 = await errorMessage1.getText();
        expect(errorText1).toContain('ID Number is required');
    });

    test('Login with missing pasword', async () => {
        await driver.get('http://localhost:3000/auth/login');

        await driver.findElement(By.name('user_idnum')).sendKeys('19099456');
        await driver.findElement(By.name('user_password')).sendKeys('');

        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for error message to appear
        const errorMessage2 = await driver.wait(
            until.elementLocated(By.xpath("//*[@id=':R2l7rrrcq:-form-item-message']")),
            5000
        );

        const errorText2 = await errorMessage2.getText();
        expect(errorText2).toContain('Password is required');
    });

    test('Login with incorrect ID number', async () => {
        await driver.get('http://localhost:3000/auth/login');

        await driver.findElement(By.name('user_idnum')).sendKeys('20200754');
        await driver.findElement(By.name('user_password')).sendKeys('glenn');

        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for error message to appear
        const errorMessage = await driver.wait(
            until.elementLocated(By.className('error-message')),
            5000
        );

        const errorText = await errorMessage.getText();
        expect(errorText).toContain('Invalid credentials');
    });

    test('Login with incorrect password', async () => {
        await driver.get('http://localhost:3000/auth/login');

        await driver.findElement(By.name('user_idnum')).sendKeys('19099456');
        await driver.findElement(By.name('user_password')).sendKeys('1234');

        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for error message to appear
        const errorMessage = await driver.wait(
            until.elementLocated(By.className('error-message')),
            5000
        );

        const errorText = await errorMessage.getText();
        expect(errorText).toContain('Invalid credentials');
    });

    test('Login with correct ID number and password', async () => {
        // Navigate to login page
        await driver.get('http://localhost:3000/auth/login');

        // Find and fill in the login form
        await driver.findElement(By.name('user_idnum')).sendKeys('19099456');
        await driver.findElement(By.name('user_password')).sendKeys('glenn');

        // Submit the form
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for navigation to complete and verify redirect
        await driver.wait(until.urlIs('http://localhost:3000/'), 5000);
        
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe('http://localhost:3000/');
    });
});
