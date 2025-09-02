describe('Routing – links work correctly', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('navigation and layout', () => {
    cy.get('nav').should('exist');
    cy.contains('Products').should('be.visible');
    cy.contains('Cart').should('be.visible');
    cy.contains('Manage Products').should('be.visible'); // no "Payment" in top nav
    cy.get('nav a').its('length').should('be.gte', 2);
  });

  it('navigates between routes via links/buttons', () => {
    cy.contains('Products').click();
    cy.url().should('match', /(\/?)(\?|$)/);
    cy.get('.products', { timeout: 10000 }).should('exist');
    cy.get('.products > div', { timeout: 10000 }).its('length').should('be.gte', 1);

    cy.contains('Cart').click();
    cy.url().should('include', '/cart');
    cy.contains('h2', /shopping cart/i, { timeout: 10000 }).should('be.visible');

    cy.contains('Products').click();
    cy.url().should('match', /(\/?)(\?|$)/);
    cy.get('.products').should('exist');

    cy.contains('Manage Products').click();
    cy.url().should('include', '/manage');
    cy.get('form').should('exist');

    cy.contains('Cart').click();
    cy.contains('h2', /shopping cart/i).should('be.visible');

    cy.contains('Products').click();
    cy.get('.products > div').its('length').should('be.gte', 1);
    cy.get('.products > div').first().within(() => {
      cy.contains('button', /add to cart/i).should('be.visible').click({ force: true });
    });
    cy.contains('Cart').click();
    cy.get('.cart-item', { timeout: 10000 }).its('length').should('be.gte', 1);

    cy.contains(/proceed to payment/i, { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.url().should('include', '/payment');
  });
});
