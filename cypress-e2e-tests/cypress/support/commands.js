Cypress.Commands.add('getElementAndTypeText', (element, text) => {
    if (text == '') {
        cy.get(element).clear()
    } else {
        cy.get(element).clear().click().type(text).should('have.value', text)
    }
})
