// cypress/e2e/ui/08_navigation_responsiveness.cy.js
describe('Navigation – responsiveness', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('navigation and layout on desktop', () => {
    cy.viewport(1280, 800);

    cy.get('nav').should('exist');
    cy.contains('Products').should('be.visible');
    cy.contains('Cart').should('be.visible');
    cy.contains('Manage Products').should('be.visible'); // no "Payment" in top nav
    cy.get('nav a').its('length').should('be.gte', 2);
  });

  it('navigation and interactions on mobile', () => {
    cy.viewport(375, 667); // iPhone-ish

    cy.get('nav').should('exist');
    cy.contains('Products').should('be.visible');
    cy.contains('Cart').should('be.visible');
    cy.contains('Manage Products').should('be.visible');

    cy.contains('Products').click();
    cy.url().should('match', /(\/?)(\?|$)/);

    cy.get('.products', { timeout: 10000 }).should('exist');
    cy.get('.products > div', { timeout: 10000 }).its('length').should('be.gte', 1);

    cy.get('.products > div').first().within(() => {
      cy.contains('button', /add to cart/i).should('be.visible').click({ force: true });
    });

    cy.contains('Cart').click();
    cy.contains('h2', /shopping cart/i, { timeout: 10000 }).should('be.visible');
    cy.get('.cart-item', { timeout: 10000 }).its('length').should('be.gte', 1);
    cy.contains(/total/i).should('exist');
  });
});
