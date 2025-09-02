describe('Product edit – positive path', () => {
    beforeEach(() => {
        cy.visit('/');

        cy.intercept('PUT', '/api/products/*').as('updateProduct');
    });

    it('navigation and layout', () => {
        cy.get('nav').should('exist');
        cy.contains('Products').should('be.visible');
        cy.contains('Cart').should('be.visible');
        cy.contains('Manage Products').should('be.visible');
        cy.get('nav a').its('length').should('be.gte', 2);
    });

    it('edits a product and verifies updated name in the list', () => {
        cy.contains('Products').click();
        cy.url().should('match', /(\/?)(\?|$)/);

        cy.get('.products').should('exist');
        cy.get('.products > div').its('length').should('be.gte', 1);

        cy.get('.products > div').first().within(() => {
            cy.contains('button', /^Edit$/).should('be.visible').click({ force: true });
        });

        const newName = `Edited Item ${Date.now()}`;
        const newPrice = '777.77';

        cy.get('.products > div').first().within(() => {
            cy.get('input[type="text"]').clear().type(newName);
            cy.get('input[type="number"]').clear().type(newPrice);
            cy.contains('button', /^Save$/).should('be.visible').click({ force: true });
        });

        cy.wait('@updateProduct');

        cy.reload();

        cy.contains('.products > div h3', newName, { timeout: 10000 }).should('be.visible');

    });
});
