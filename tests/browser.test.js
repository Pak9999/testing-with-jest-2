const { Builder, By, until } = require('selenium-webdriver');
require('geckodriver');

// Här anger vi var testfilen ska hämtas. De konstiga replaceAll-funktionerna ersätter
// mellanslag med URL-säkra '%20' och backslash (\) på Windows med slash (/).
const fileUnderTest = 'file://' + __dirname.replaceAll(/ /g, '%20').replaceAll(/\\/g, '/') + '/../dist/index.html';
const defaultTimeout = 10000;
let driver;
jest.setTimeout(1000 * 60 * 5); // 5 minuter

// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång
beforeAll(async () => {
console.log(fileUnderTest);
    driver = await new Builder().forBrowser('firefox').build();
    await driver.get(fileUnderTest);
});

// Allra sist avslutar vi Firefox igen
afterAll(async() => {
    await driver.quit();
}, defaultTimeout);

test('The stack should be empty in the beginning', async () => {
    let stack = await driver.findElement(By.id('top_of_stack')).getText();
    expect(stack).toEqual("n/a");
});

describe('Clicking "Pusha till stacken"', () => {
    it('should open a prompt box', async () => {
        let push = await driver.findElement(By.id('push'));
        await push.click();
        let alert = await driver.switchTo().alert();
        await alert.sendKeys("Bananer");
        await alert.accept();
    });
});

// mitt test
describe('Clicking "Poppa stacken!"', () => {
    it('should remove the top element and show an alert', async () => {
        try {
            console.log('Running test: pop button functionality');
            
            // First så lägger vi till ett värde i stacken för att säkerställa att det finns något att poppa
            let push = await driver.findElement(By.id('push'));
            await push.click();
            let pushAlert = await driver.switchTo().alert();
            await pushAlert.sendKeys("Äpple");
            await pushAlert.accept();
            
            // Kolla att stacken innehåller det värde vi just lagt till
            let stackBefore = await driver.findElement(By.id('top_of_stack')).getText();
            expect(stackBefore).toEqual("Äpple");
            
            // Nu ska vi poppa stacken
            let pop = await driver.findElement(By.id('pop'));
            await pop.click();
              // kolla att alerten dyker upp och att den innehåller rätt text
            let popAlert = await driver.switchTo().alert();
            let alertText = await popAlert.getText();
            expect(alertText).toContain("Tog bort Äpple");
            await popAlert.accept();
              // Stacken uppdateras inte automatiskt efter pop, så den visar fortfarande det senaste pushade värdet
            let stackAfter = await driver.findElement(By.id('top_of_stack')).getText();
            expect(stackAfter).toEqual("Äpple");
        } catch (error) {
            console.error('Error during "pop button" test:', error);
            throw error;
        }
    }, defaultTimeout);
});
