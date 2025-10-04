describe('smoke', () => {
  it('serves the app (200) & renders root', () => {
    cy.request('/').its('status').should('eq', 200);
    cy.visit('/');
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body', { timeout: 10000 }).should('be.visible');
    cy.get('#root', { timeout: 10000 }).should('exist');
  });
});
