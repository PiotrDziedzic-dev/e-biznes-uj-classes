describe('Product Management – add product', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('navigation and layout', () => {
    cy.get('nav').should('exist');
    cy.contains('Products').should('be.visible');
    cy.contains('Cart').should('be.visible');
    cy.contains('Manage Products').should('be.visible'); // matches App.js
    cy.get('nav a').its('length').should('be.gte', 2);
  });

  it('creates a new product and verifies it in the list', () => {
    const name = `PM Created ${Date.now()}`;
    const price = '123.45';
    const category = 'Cypress';

    cy.contains('Manage Products').click();

    // Intercepty dla stabilności
    cy.intercept('POST', '/api/products').as('createProduct');
    cy.intercept('GET', '/api/products').as('getProducts');

    cy.get('form').should('exist').within(() => {
      cy.get('input[type="text"]').first().clear().type(name);   // name
      cy.get('input[type="number"]').first().clear().type(price); // price
      // category opcjonalnie (drugi text input, jeśli istnieje)
      cy.get('input[type="text"]').then($texts => {
        if ($texts.length > 1) {
          cy.wrap($texts.eq(1)).clear().type(category);
        }
      });
      cy.contains('button', /add|create|save/i).should('be.visible').click({ force: true });
    });

    // Upewnij się, że POST przeszedł
    cy.wait('@createProduct').its('response.statusCode').should('be.oneOf', [200, 201]);

    // Przejdź do Products i poczekaj na pobranie listy
    cy.contains('Products').click();
    cy.wait('@getProducts'); // jeśli nie złapie, i tak dodatkowe asercje poniżej zabezpieczą

    // Upewnij się, że lista jest wyrenderowana
    cy.get('.products', { timeout: 10000 }).should('exist');
    cy.get('.products > div', { timeout: 10000 }).its('length').should('be.gte', 1);

    // Znajdź *kartę*, która zawiera nazwę (bez parentsUntil / reparentingu)
    cy.contains('.products > div', name, { timeout: 10000 })
        .should('be.visible')
        .within(() => {
          cy.contains(/price:/i).should('exist');
        });
  });
});
