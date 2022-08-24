import { HOME } from '../../custom/locators/home'

function openLoginModal() {
    cy.get(HOME.LOGIN_MODAL.MODAL).then($modal => {
        if (!$modal.is(':visible')) {
            cy.get(HOME.MAIN_PAGE.TOP_CONTAINER).find(HOME.MAIN_PAGE.LOGIN_LINK).click()
        }
    })
    cy.get(HOME.LOGIN_MODAL.MODAL).filter(':visible').should('exist')
}

function enterUsername(name) {
    if (name == '') {
        cy.get(HOME.LOGIN_MODAL.USERNAME).clear()
    } else {
        cy.getElementAndTypeText(HOME.LOGIN_MODAL.USERNAME, name)
    }
}

function enterPassword(password) {
    if (password == '') {
        cy.get(HOME.LOGIN_MODAL.PASSWORD).clear()
    } else {
        cy.getElementAndTypeText(HOME.LOGIN_MODAL.PASSWORD, password)
    }
}

function clickLoginButton() {
    cy.get(HOME.LOGIN_MODAL.MODAL).find(HOME.LOGIN_MODAL.LOGIN_BUTTON).click()
}

function login(user, password) {
    openLoginModal()
    enterUsername(user)
    enterPassword(password)
    clickLoginButton()
}

function logout() {
    cy.get(HOME.MAIN_PAGE.LOGOUT_LINK).click()
}

export default {
    openLoginModal,
    login,
    logout
}