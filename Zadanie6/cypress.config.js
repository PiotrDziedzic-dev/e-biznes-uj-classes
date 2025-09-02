const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    video: false,
    defaultCommandTimeout: 8000
  },
  env: {
    apiBase: 'http://localhost:8080/api'
  }
});
