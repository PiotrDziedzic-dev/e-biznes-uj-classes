describe('Products view', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('navigation and layout', () => {
    cy.get('nav').should('exist');
    cy.contains('Products').should('be.visible');
    cy.contains('Cart').should('be.visible');
    cy.contains('Manage Products').should('be.visible'); // top nav button
    cy.get('nav a').its('length').should('be.gte', 2);
  });

  it('lists products and supports interactions', () => {
    cy.contains('Products').click();
    cy.url().should('match', /(\/?)(\?|$)/);

    cy.get('.products').should('exist');
    cy.get('.products > div').its('length').should('be.gte', 1);

    cy.contains('button', /add to cart/i).first().click({ force: true });

    cy.contains('Cart').click();
    cy.get('.cart-item').its('length').should('be.gte', 1);
    cy.contains(/total/i).should('exist');
  });
});
