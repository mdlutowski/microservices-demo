Cypress.Commands.add('getElementAndTypeText', (element, text) => {
  if (text == '') {
    cy.get(element).clear()
  } else {
    cy.get(element).clear().click().type(text).should('have.value', text)
  }
})

Cypress.Commands.add('setWaitWithAction', (route, alias, action) => {
  cy.intercept('GET', route).as(alias)
  action()
  cy.wait(`@${alias}`)
})
