const { defineConfig } = require("cypress");

module.exports = defineConfig({
  defaultCommandTimeout: 30000,
  requestTimeout: 30000,
  videoCompression: false,
  e2e: {
    baseUrl:"https://sandbox-app.oexpress.co.id/",
    // MAILOSAUR_API_KEY : "NGlbK67cZMfXRNAC5iz5pxKBmWKsfW8V",
    env:{
      "CYPRESS_API_KEY": "d3dcaf745575acef863b198f927fbd7a8183ba015c0f58cbbd4f80f2466b9cc0",
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
