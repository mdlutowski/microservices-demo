import './commands'

Cypress.on('uncaught:exception', () => {
  return false
})

before(function () {
  cy.visit('/')
})
