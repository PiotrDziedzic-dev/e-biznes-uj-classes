describe('Cart – remove items', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('navigation and layout', () => {
    cy.get('nav').should('exist');
    cy.contains('Products').should('be.visible');
    cy.contains('Cart').should('be.visible');
    cy.contains('Manage Products').should('be.visible');
    cy.get('nav a').its('length').should('be.gte', 2);
  });

  it('adds then removes an item from the cart', () => {
    cy.contains('Products').click();
    cy.url().should('match', /(\/?)(\?|$)/);
    cy.get('.products').should('exist');
    cy.get('.products > div').its('length').should('be.gte', 1);
    cy.contains('button', /add to cart/i).first().click({ force: true });

    cy.contains('Cart').click();
    cy.contains('h2', /shopping cart/i).should('be.visible');
    cy.get('.cart-item').should('have.length.greaterThan', 0);

    cy.get('.cart-item').then(($rowsBefore) => {
      const before = $rowsBefore.length;

      cy.get('.cart-item').first().within(() => {
        cy.contains('button', /^Remove$/).should('be.visible').click({ force: true });
      });

      cy.get('.cart-item', { timeout: 8000 }).should(($rowsAfter) => {
        expect($rowsAfter.length).to.be.lessThan(before);
      });
    });

    cy.contains(/total/i).should('exist');
  });
});
