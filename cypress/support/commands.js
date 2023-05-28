// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import "cypress-mailosaur";
const { MailSlurp } = require('mailslurp-client');
// set your api key with an environment variable `CYPRESS_API_KEY` or configure using `env` property in config file
// (cypress prefixes environment variables with CYPRESS)
const apiKey = 'd3dcaf745575acef863b198f927fbd7a8183ba015c0f58cbbd4f80f2466b9cc0';
const mailslurp = new MailSlurp({ apiKey });

Cypress.Commands.add("createInbox", () => {
  return mailslurp.createInbox();
});

Cypress.Commands.add("waitForLatestEmail", (inboxId, timeoutMillis, unreadOnly) => {
  // how long we should hold connection waiting for an email to arrive
  const defaultTimeoutMillis = 30_000;
  return mailslurp.waitForLatestEmail(inboxId, timeoutMillis ? timeoutMillis : defaultTimeoutMillis, unreadOnly)
});

import 'cypress-file-upload';
Cypress.Commands.add('upload_file', (fileName, fileType = ' ', selector) => {
cy.get(selector).then(subject => {
cy.fixture(fileName, 'base64').then(content => {
const el = subject[0];
const testFile = new File([content], fileName, { type: fileType });
const dataTransfer = new DataTransfer();
dataTransfer.items.add(testFile);
el.files = dataTransfer.files;
});
});
});