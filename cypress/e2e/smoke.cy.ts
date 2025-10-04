describe('App loads', () => {
  it('shows the page and has content', () => {
    cy.visit('/');
    // Beispiel-Assertions (bitte auf dein Projekt anpassen)
    cy.contains(/vite|react|welcome/i);
    cy.get('body').should('be.visible');
  });
});
