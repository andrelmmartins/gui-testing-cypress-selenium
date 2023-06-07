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

  

  it('tentar criar uma taxação e cancela', async () => {
    await driver.findElement(By.linkText('Tax rates')).click();
    await driver.findElement(By.css('.admin-layout__content > div > .middle > div > a')).click();
    await driver.findElement(By.css('input[name="sylius_tax_rate[code]"]')).sendKeys('teste');
    await driver.findElement(By.css('input[name="sylius_tax_rate[name]"]')).sendKeys('teste');
    await driver.findElement(By.css('.admin-layout__content form > .ui.buttons > a')).click();
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Clothing Sales Tax 7%'));
    assert(bodyText.includes('Sales Tax 20%'));
  });

  it('tenta criar uma taxa com erro', async () => {
    await driver.findElement(By.linkText('Tax rates')).click();
    await driver.findElement(By.css('.admin-layout__content > div > .middle > div > a')).click();
    await driver.findElement(By.css('input[name="sylius_tax_rate[code]"]')).sendKeys('teste');
    await driver.findElement(By.css('input[name="sylius_tax_rate[name]"]')).sendKeys('teste');
    await driver.findElement(By.css('.admin-layout__content form > .ui.buttons > button')).click();
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Please select tax zone.'));
  });  

  it('cria uma taxação', async () => {
    await driver.findElement(By.linkText('Tax rates')).click();
    await driver.findElement(By.css('.admin-layout__content > div > .middle > div > a')).click();
    await driver.findElement(By.css('input[name="sylius_tax_rate[code]"]')).sendKeys('teste');
    await driver.findElement(By.css('input[name="sylius_tax_rate[name]"]')).sendKeys('teste');
    await driver.findElement(By.css('select[name="sylius_tax_rate[zone]"]')).sendKeys('United States of America');
    await driver.findElement(By.css('.admin-layout__content form > .ui.buttons > button')).click();
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Tax rate has been successfully created.'));
    assert(bodyText.includes('teste'));
  });

  it('testa o limpa filtros', async () => {
    await driver.findElement(By.linkText('Tax rates')).click();
    await driver.findElement(By.id('criteria_search_value')).sendKeys('7');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    await driver.findElement(By.css('.ui > div > .ui > .ui:nth-child(2)')).click();
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Clothing Sales Tax 7%'));
    assert(bodyText.includes('Sales Tax 20%'));
  });

  it('edita a taxa', async () => {
    await driver.findElement(By.linkText('Tax rates')).click();
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[buttons.length - 2].click();
    await driver.findElement(By.css('input[name="sylius_tax_rate[code]"]')).clear();
    await driver.findElement(By.css('input[name="sylius_tax_rate[code]"]')).sendKeys('edited');
    await driver.findElement(By.css('.admin-layout__content form > .ui.buttons > button')).click();
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Tax rate has been successfully updated.'));
    assert(bodyText.includes('edited'));
  });

  it('deleta a taxa', async () => {
    await driver.findElement(By.linkText('Tax rates')).click();
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[buttons.length - 1].click();
    await driver.wait(until.alertIsPresent());
    await driver.switchTo().alert().accept();
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Tax rate has been successfully deleted.'));
    assert(!bodyText.includes('Clothing Sales Tax 7%'));
  });

  it('deleta todas as taxas', async () => {
    await driver.findElement(By.linkText('Tax rates')).click();
    const checkboxes = await driver.findElements(By.css('input[type="checkbox"][name^="selection"]'));
    for (let checkbox of checkboxes) {
      await checkbox.click();
    }
    await driver.findElement(By.css('.admin-layout__content > .ui > .ui > .ui > .ui')).click();
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('No results found'));
  });

  it('mostra que existem taxas sendo cobradas no carrinho', async () => {
    await driver.get('http://localhost:8080/en_US/taxable');
    await driver.findElement(By.css('.sylius-product-name')).click();
    await driver.findElement(By.css('.ui.blue.button')).click();
    await driver.findElement(By.css('.item.tax-total > strong')).getText().then(text => {
      assert.strictEqual(text, '$0.21');
    });
  });

  it('mostra que existem taxas sendo cobradas dentro da área de ordens', async () => {
    await driver.get('http://localhost:8080/admin/sales/order');
    await driver.findElement(By.css('.ui.orange.button')).click();
    await driver.findElement(By.css('.sylius-product-name')).click();
    await driver.findElement(By.css('.item.tax-total > strong')).getText().then(text => {
      assert.strictEqual(text, '$0.21');
    });
  });
});
