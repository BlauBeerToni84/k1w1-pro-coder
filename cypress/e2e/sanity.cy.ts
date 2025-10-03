describe('sanity', () => {
  it('works', () => {
    expect(true).to.equal(true)
  })
  // wenn dev server läuft:
  // it('home loads', () => {
  //   cy.visit('/')               // nutzt baseUrl
  //   cy.contains('html')         // irgendwas simples prüfen
  // })
})
