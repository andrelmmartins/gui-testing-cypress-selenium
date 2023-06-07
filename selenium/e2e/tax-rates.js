const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('tax rates', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:8080/admin');
    // await driver.get('http://150.165.75.99:8080/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    // await driver.sleep(1000);
  });

  it('validate filter applied through cancel button', async () => {
    await driver.findElement(By.linkText('Tax rates')).click();
    await driver.findElement(By.id('criteria_search_value')).sendKeys('7');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[buttons.length - 1].click();
    await driver.findElement(By.css('.admin-layout__content > .ui > .ui > .ui > .ui:nth-child(2)')).click();
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Clothing Sales Tax 7%'));
    assert(!bodyText.includes('Sales Tax 20%'));
  });
});
