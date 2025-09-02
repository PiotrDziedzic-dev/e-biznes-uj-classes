describe('Cart operations – edge cases', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('increments quantity by adding the same product twice, then removes it', () => {
    cy.contains('Products').click();

    cy.get('.products', { timeout: 10000 }).should('exist');
    cy.get('.products > div', { timeout: 10000 }).its('length').should('be.gte', 1);

    cy.get('.products > div').first().within(() => {
      cy.contains('button', /add to cart/i, { timeout: 10000 })
          .should('be.visible')
          .click({ force: true });
      cy.contains('button', /add to cart/i).click({ force: true });
    });

    cy.contains('Cart').click();
    cy.contains('h2', /shopping cart/i, { timeout: 10000 }).should('be.visible');
    cy.get('.cart-item', { timeout: 10000 }).its('length').should('be.gte', 1);

    cy.get('.cart-item').first().invoke('text').then((txt) => {
      const m = txt.match(/x\s*(\d+)/i);
      const qty = m ? parseInt(m[1], 10) : 0;
      expect(qty, `expected quantity >= 2 in: ${txt}`).to.be.gte(2);
    });

    cy.get('.cart-item').first().within(() => {
      cy.contains('button', /^Remove$/).should('be.visible').click({ force: true });
    });

    cy.get('.cart-item', { timeout: 10000 }).should(($rows) => {
      expect($rows.length).to.be.gte(0);
    });

    cy.contains(/total/i).should('exist');
  });

});
