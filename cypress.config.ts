import { defineConfig } from "cypress";

const PORT = process.env.PORT || "8080";

export default defineConfig({
  reporter: "junit",
  reporterOptions: {
    mochaFile: "reports/cypress-[hash].xml",
    toConsole: false,
  },
  video: false,
  e2e: {
    baseUrl: `http://127.0.0.1:${PORT}`,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
  },
});
