import { defineConfig } from 'cypress';

import * as dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalModifyObstructiveThirdPartyCode: true,
    baseUrl: 'http://localhost:3000',
    pageLoadTimeout: 1000000,
    defaultCommandTimeout: 10000
  },    
  env: {
    auth_url: process.env.auth_url,
    login_url: process.env.login_url,
    login_email: process.env.login_email,
    login_pwd: process.env.login_pwd,
  },
});
