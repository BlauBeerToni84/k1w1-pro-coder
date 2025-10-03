const { defineConfig } = require('cypress')
module.exports = defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'reports/cypress-[hash].xml',
    toConsole: true,
  },
  e2e: {
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}',
    baseUrl: 'http://127.0.0.1:8080', // falls du gegen deinen Dev-Server testen willst
  },
})
