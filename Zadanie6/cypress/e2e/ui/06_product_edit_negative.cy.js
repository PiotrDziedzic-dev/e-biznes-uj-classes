describe('Product edit – negative path', () => {
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

  it('does not allow saving an empty name (name stays non-empty after attempted save)', () => {
    cy.contains('Products').click();
    cy.url().should('match', /(\/?)(\?|$)/);

    cy.get('.products', { timeout: 10000 }).should('exist');
    cy.get('.products > div', { timeout: 10000 }).its('length').should('be.gte', 1);

    cy.get('.products > div').first().find('h3').invoke('text').then((txt) => {
      const originalName = txt.trim();
      expect(originalName).to.not.equal('');

      cy.get('.products > div').first().within(() => {
        cy.contains('button', /^Edit$/).should('be.visible').click({ force: true });

        cy.get('input[type="text"]').first().clear();


        cy.get('input[type="number"]').first().then($num => {
          if ($num.length) {
            const val = $num.val() || '1';
            cy.wrap($num).clear().type(String(val));
          }
        });

        cy.contains('button', /^Save$/).should('be.visible').click({ force: true });
      });


      cy.reload();

      cy.contains('.products > div h3', originalName, { timeout: 10000 }).should('exist');
    });
  });
});
