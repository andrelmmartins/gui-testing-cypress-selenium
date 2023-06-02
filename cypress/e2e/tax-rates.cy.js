describe('tax rates', () => {
  
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });

  // Remove .only and implement others test cases!
  it('validate filter applied through cancel button', () => {
    // Click in tax rates in side menu
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    // Type in value input to search for specify tax rate
    cy.get('[id="criteria_search_value"]').type('7');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last tax rate
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Click on cancel button
    cy.get('.admin-layout__content > .ui > .ui > .ui > .ui:nth-child(2)').click();

    // Assert that we are back to the listing page with the filter applied
    cy.get('body').should('contain', 'Clothing Sales Tax 7%').and('not.contain', 'Sales Tax 20%');
  });

  it('tentar criar uma taxação e cancela', () => {
    // Click in tax rates in side menu
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    // clica no botão de criar
    cy.get('.admin-layout__content > div > .middle > div > a').click();
    // adiciona código
    cy.get('input[name="sylius_tax_rate[code]"]').type('teste');
    // adicionar nome
    cy.get('input[name="sylius_tax_rate[name]"]').type('teste');
    // clica em cancelar
    cy.get('.admin-layout__content form > .ui.buttons > a').click();

    // verifica se só tem as duas taxas iniciais
    cy.get('body').should('contain', 'Clothing Sales Tax 7%').and('contain', 'Sales Tax 20%');
  });

  it('tenta criar uma taxa com erro', () => {
    // Click in tax rates in side menu
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    // clica no botão de criar
    cy.get('.admin-layout__content > div > .middle > div > a').click();
    // adiciona código
    cy.get('input[name="sylius_tax_rate[code]"]').type('teste');
    // adicionar nome
    cy.get('input[name="sylius_tax_rate[name]"]').type('teste');
    // clica em create
    cy.get('.admin-layout__content form > .ui.buttons > button').click();

    // verifica se teve alerta de erro
    cy.get('body').should('contain', 'Please select tax zone.')
  });

  it('cria uma taxação', () => {
    // Click in tax rates in side menu
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    // clica no botão de criar
    cy.get('.admin-layout__content > div > .middle > div > a').click();
    // adiciona código
    cy.get('input[name="sylius_tax_rate[code]"]').type('teste');
    // adicionar nome
    cy.get('input[name="sylius_tax_rate[name]"]').type('teste');
    // seleciona zona
    cy.get('select[name="sylius_tax_rate[zone]"]').select('United States of America');
    // clica em create
    cy.get('.admin-layout__content form > .ui.buttons > button').click();

    // verifica alerta de sucesso
    cy.get('body').should('contain', 'Tax rate has been successfully created.')
  });

  it('testa o limpa filtros', () => {
    // Click in tax rates in side menu
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    // digita o nome da taxa errada
    cy.get('[id="criteria_search_value"]').type('testa');
    // clica no botão de busca
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // verifica se não tem nenhuma taxação
    cy.get('body').should('contain', 'There are no results to display');
    // limpa todos os filtros
    cy.get('.admin-layout__content div[class="ui styled fluid accordion"] > div[class="content active"] > form > a').click();
    // digita o nome da taxa certa
    cy.get('[id="criteria_search_value"]').type('teste');
    // clica no botão de busca
    cy.get('*[class^="ui blue labeled icon button"]').click();

    // verifica se encontrou a certa
    cy.get('body').should('contain', 'teste').and('not.contain', 'Clothing Sales Tax 7%').and('not.contain', 'Sales Tax 20%');
  });

  it('edita a taxa', () => {
    // Click in tax rates in side menu
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    // filtra pelo nome da taxa
    cy.get('[id="criteria_search_value"]').type('teste');
    // clica no botão de filtrar
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // clica no botão de editar da taxa encontrada
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // edita o nome da taxa
    cy.get('input[name="sylius_tax_rate[name]"]').clear().type('teste_editado');
    // clica em salvar
    cy.get('.admin-layout__content form > .ui.buttons > button').click();

    // verifica se tem a ultima taxa tem o nome editado
    cy.get('body').should('contain', 'Tax rate has been successfully updated.')
  });

  it('deleta a taxa', () => {
    // Click in tax rates in side menu
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    // filtra pelo nome da taxa
    cy.get('[id="criteria_search_value"]').type('teste_editado');
    // clica no botão de filtrar
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // clica no botão de deletar da taxa encontrada
    cy.get('.admin-layout__content > div > div > table > tbody > tr > td > div > form > button').last().click();
    // confima delete
    cy.get('div[id="confirmation-button"]').click();
    // limpa todos os filtros
    cy.get('.admin-layout__content > div[class="ui styled fluid accordion"] > div[class="content active"] > form > a').click();
  
    // verifica se a taxa não existe mais
    cy.get('body').should('not.contain', 'teste').and('contain', 'Clothing Sales Tax 7%').and('contain', 'Sales Tax 20%');
  });

  it('deleta todas as taxas', () => {
    // Click in tax rates in side menu
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    // clica no botão de deletar da taxa encontrada
    cy.get('.admin-layout__content > div > div > table > thead > tr > th > input[type="checkbox"]').click();
    // clica no botão de deletar tudo
    cy.get('.sylius-grid-nav > .sylius-grid-nav__bulk > form > button').click();
    // confima delete
    cy.get('div[id="confirmation-button"]').click();

    // verifica se todas as taxas foram excluídas
    cy.get('body').should('contain', 'There are no results to display').and('not.contain', 'teste').and('not.contain', 'Clothing Sales Tax 7%').and('not.contain', 'Sales Tax 20%');
  });

  it('mostra que existem taxas sendo cobradas no carrinho', () => {
    // vai para uma página de produto
    cy.visit('/en_US/products/knitted-burgundy-winter-cap');
    // muda o numero ce produtos
    cy.get('#sylius-product-selecting-variant > form > div > input').clear().type(2);
    // adiciona produto no carrinho
    cy.get('#sylius-product-selecting-variant > form > button').click();
    // vai para o carrinho
    cy.visit('/en_US/cart/');

    // verifica se na área de preço tem uma que informa sobre as taxas
    cy.get('body').should('contain', 'Taxes total:')
  });

  it('mostra que existem taxas sendo cobradas dentro da área de ordens', () => {
    // entranha na área de ordens
    cy.clickInFirst('a[href="/admin/orders/"]');
    // adiciona no campo de filtro Sammy
    cy.get('[id="criteria_customer_value"]').type('Sammy');
    // clica em filtrar
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // entra na primeira compra clicando em show
    cy.get('.sylius-grid-wrapper > div > table > tbody > tr > td > div > a').last().click();

    // verifica se na descrição da compra mostra um valor de taxa
    cy.get('body').should('contain', 'Tax total:')
  });

  // Implement the remaining test cases in a similar manner
});
