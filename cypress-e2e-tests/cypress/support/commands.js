Cypress.Commands.add('getElementAndTypeText', (element, text) => {
    cy.get(element).clear().click().type(text).should('have.value', text)
})
