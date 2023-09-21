import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalModifyObstructiveThirdPartyCode: true,
    baseUrl: 'http://localhost:3000',
    pageLoadTimeout: 1000000,
    defaultCommandTimeout: 10000
  }
});
