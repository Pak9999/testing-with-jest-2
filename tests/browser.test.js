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

// Mina test
describe('Clicking "Poppa stacken!"', () => {
    it('should show an alert when clicked', async () => {
        try {
            console.log('Running test: pop button UI interaction');
            
            // Kontrollera att pop-knappen finns och är klickbar
            let pop = await driver.findElement(By.id('pop'));
            expect(pop).toBeDefined();
            
            // Klicka på knappen
            await pop.click();
            
            // Verifiera att en alert visas och att den är definierad
            let alert = await driver.switchTo().alert();
            expect(alert).toBeDefined();
            
            // Stäng alerten
            await alert.accept();
        } catch (error) {
            console.error('Error during "pop button" UI interaction test:', error);
            throw error;
        }
    }, defaultTimeout);
});

describe('Clicking "Vad finns överst på stacken?"', () => {
    it('should update the display with the top element', async () => {
        try {
            console.log('Running test: peek button UI interaction');
            
            // Först pushar vi något på stacken för att ha något att visa
            let push = await driver.findElement(By.id('push'));
            await push.click();
            let pushAlert = await driver.switchTo().alert();
            await pushAlert.sendKeys("Päron");
            await pushAlert.accept();
            
            // Klicka på peek-knappen
            let peek = await driver.findElement(By.id('peek'));
            expect(peek).toBeDefined();
            await peek.click();
            
            // Kontrollera att UI-elementet uppdateras aka vi testar endast att UI uppdateras, inte den underliggande datastrukturen
            let display = await driver.findElement(By.id('top_of_stack'));
            let displayText = await display.getText();
            expect(displayText).toBeDefined();
            expect(displayText).not.toEqual("n/a");
        } catch (error) {
            console.error('Error during "peek button" UI interaction test:', error);
            throw error;
        }
    }, defaultTimeout);
});