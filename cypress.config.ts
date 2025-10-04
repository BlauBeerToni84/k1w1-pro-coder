import { defineConfig } from "cypress";
const PORT = process.env.PORT || "5173";
export default defineConfig({
  retries: { runMode: 2, openMode: 0 },
  defaultCommandTimeout: 8000,
    experimentalMemoryManagement: true,
  numTestsKeptInMemory: 0,
  video: false,
reporter: "junit",
  reporterOptions: { mochaFile: "reports/cypress-[hash].xml", toConsole: false },
  video: false,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
  e2e: {
    baseUrl: `http://127.0.0.1:${PORT}`,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
  },
});
