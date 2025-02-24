import { HOME } from '../../custom/locators/home'
import { CATALOGUE } from '../../custom/locators/catalogue'

function openLoginModal() {
  cy.get(HOME.LOGIN_MODAL.MODAL).then(($modal) => {
    if (!$modal.is(':visible')) {
      cy.get(HOME.MAIN_PAGE.TOP_CONTAINER)
        .find(HOME.MAIN_PAGE.LOGIN_LINK)
        .click()
    }
  })
  cy.get(HOME.LOGIN_MODAL.MODAL).filter(':visible').should('exist')
}

function login(username, password) {
  openLoginModal()
  cy.getElementAndTypeText(HOME.LOGIN_MODAL.USERNAME, username)
  cy.getElementAndTypeText(HOME.LOGIN_MODAL.PASSWORD, password)
  cy.get(HOME.LOGIN_MODAL.MODAL).find(HOME.LOGIN_MODAL.LOGIN_BUTTON).click()
}

function logout() {
  cy.get(HOME.MAIN_PAGE.LOGOUT_LINK).click()
}

function logoutIfLoggedIn() {
  cy.get('body').then(($body) => {
    if ($body.find(HOME.MAIN_PAGE.LOGOUT_LINK).length) {
      logout()
    }
  })
}

function openRegisterModal() {
  cy.get(HOME.REGISTER_MODAL.MODAL).then(($modal) => {
    if (!$modal.is(':visible')) {
      cy.get(HOME.MAIN_PAGE.TOP_CONTAINER)
        .find(HOME.MAIN_PAGE.REGISTER_LINK)
        .click()
    }
  })
  cy.get(HOME.REGISTER_MODAL.MODAL).filter(':visible').should('exist')
}

function register(username, firstName, lastName, email, password) {
  openRegisterModal()
  cy.getElementAndTypeText(HOME.REGISTER_MODAL.USERNAME, username)
  cy.getElementAndTypeText(HOME.REGISTER_MODAL.FIRST_NAME, firstName)
  cy.getElementAndTypeText(HOME.REGISTER_MODAL.LAST_NAME, lastName)
  cy.getElementAndTypeText(HOME.REGISTER_MODAL.EMAIL, email)
  cy.getElementAndTypeText(HOME.REGISTER_MODAL.PASSWORD, password)
  cy.get(HOME.REGISTER_MODAL.MODAL)
    .find(HOME.REGISTER_MODAL.REGISTER_BUTTON)
    .click()
}

function goToCatalogue() {
  cy.get(HOME.MAIN_PAGE.CATALOGUE_TAB).click()
  cy.get(CATALOGUE.MAIN_PAGE.PRODUCT_CONTAINERS)
    .filter(':visible')
    .should('have.length.at.least', 1)
}

function goToBasket() {
  cy.setWaitWithAction('/cart', 'loadBasket', () => {
    cy.get(HOME.MAIN_PAGE.BASKET_BUTTON).click()
  })
}

export default {
  openLoginModal,
  login,
  logout,
  logoutIfLoggedIn,
  openRegisterModal,
  register,
  goToCatalogue,
  goToBasket
}
