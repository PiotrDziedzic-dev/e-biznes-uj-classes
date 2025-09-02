describe('Payment – form flow', () => {
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

  it('goes to Payment from Cart and verifies the form', () => {
    cy.contains('Products').click();
    cy.get('.products', { timeout: 10000 }).should('exist');
    cy.get('.products > div', { timeout: 10000 }).its('length').should('be.gte', 1);

    cy.get('.products > div').first().within(() => {
      cy.contains('button', /add to cart/i, { timeout: 10000 })
          .should('be.visible')
          .click({ force: true });
    });

    cy.contains('Cart').click();
    cy.contains('h2', /shopping cart/i, { timeout: 10000 }).should('be.visible');
    cy.get('.cart-item', { timeout: 10000 }).its('length').should('be.gte', 1);
    cy.contains(/proceed to payment/i, { timeout: 10000 }).should('be.visible').click({ force: true });

    cy.url().should('include', '/payment');

    cy.get('form').should('exist').within(() => {
      cy.get('input').its('length').should('be.gte', 2);
      cy.get('input[type="text"]').first().then($inp => {
        if ($inp.length) cy.wrap($inp).clear().type('John Tester');
      });
      cy.get('input').eq(1).then($inp => {
        if ($inp.length) cy.wrap($inp).clear().type('4242 4242 4242 4242');
      });

      cy.contains('button', /pay|submit|confirm|finish/i).should('be.visible');
    });
  });
});
