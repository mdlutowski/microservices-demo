import { 
  openLoginModal,
  login,
  logout,
  logoutIfLoggedIn
 } from '../../support/pages/home'
import { HOME } from '../../custom/locators/home'
import { TRANSLATION } from '../../custom/translation/strings'

context("Log in an existing user", () => {
  before(() => {
    logoutIfLoggedIn()
  })

  const mainUser = Cypress.config('mainUser')
  const mainPassword = Cypress.config('mainPassword')

  describe("Scenario - Successful login using top container", () => {
    it("should open Login modal", () => {
        openLoginModal()
        cy.get(HOME.LOGIN_MODAL.MODAL).find(HOME.LOGIN_MODAL.HEADER).should('have.text', TRANSLATION.LOGIN.HEADER)
        cy.get(HOME.LOGIN_MODAL.USERNAME).invoke('attr', 'placeholder').should('equal', TRANSLATION.LOGIN.USERNAME)
        cy.get(HOME.LOGIN_MODAL.PASSWORD).invoke('attr', 'placeholder').should('equal', TRANSLATION.LOGIN.PASSWORD)
        cy.get(HOME.LOGIN_MODAL.MODAL).find(HOME.LOGIN_MODAL.LOGIN_BUTTON).should('contain.text', TRANSLATION.LOGIN.LOGIN_BUTTON)
    })

    it("should log in", () => {
      login(mainUser, mainPassword)
      //Confirm successful message
      cy.get(HOME.LOGIN_MODAL.MESSAGE).should('have.text', TRANSLATION.LOGIN.SUCCESSFUL_MESSAGE)
      //Confirm user is logged in & account menu is available & 'log in' link is no longer visible
      cy.get(HOME.MAIN_PAGE.LOGGEDIN_LINK).should($text => {
        expect($text.text().toLowerCase()).to.contain(`${TRANSLATION.LOGIN.LOGGED_IN} ${mainUser}`.toLowerCase())
      })
      cy.get(HOME.MAIN_PAGE.ACCOUNT_TAB).should('be.visible')
      cy.get(HOME.MAIN_PAGE.LOGIN_LINK).should('not.exist')
    })

    it("should log out", () => {
      //Log in if none of users is logged in yet
      cy.get('body').then($body => {
        if (!$body.find(HOME.MAIN_PAGE.LOGGEDIN_LINK).length) {
          login(mainUser, mainPassword)
        }
      })
      logout()
      //Confirm user is logged out & account menu is not available
      cy.get(HOME.MAIN_PAGE.LOGIN_LINK).should('be.visible')
      cy.get(HOME.MAIN_PAGE.ACCOUNT_TAB).should('not.exist')
    })

    it("should log out and log another user in", () => {
      cy.fixture('/testdata/users').then(users => {
        const secondUsername = users.user1.name
        const secondPassword = users.user1.password

        login(mainUser, mainPassword)
        logout()
        login(secondUsername, secondPassword)
        //Confirm user is logged in & account menu is available
        cy.get(HOME.MAIN_PAGE.LOGGEDIN_LINK).should($text => {
          expect($text.text().toLowerCase()).to.contain(`${TRANSLATION.LOGIN.LOGGED_IN} ${secondUsername}`.toLowerCase())
        })
        cy.get(HOME.MAIN_PAGE.ACCOUNT_TAB).should('be.visible')
      })
    })
  })

  describe("Scenario - Unsuccessful login using top container", () => {
    before(() => {
      logoutIfLoggedIn()
    })

    it("should not log in if user does not exist", () => {
      cy.fixture('/testdata/users').then(users => {
        login(users.fake.name, users.fake.password)
        //Confirm user is not logged in & account menu not is available
        cy.get(HOME.LOGIN_MODAL.MESSAGE).should('have.text', TRANSLATION.LOGIN.INVALID_LOGIN)
        cy.get(HOME.MAIN_PAGE.LOGGEDIN_LINK).should('not.exist')
      })
    })

    it("should not log user in without password", () => {
      login(mainUser, '')
      //Confirm user is not logged in & account menu not is available
      cy.get(HOME.LOGIN_MODAL.MESSAGE).should('have.text', TRANSLATION.LOGIN.INVALID_LOGIN)
      cy.get(HOME.MAIN_PAGE.LOGGEDIN_LINK).should('not.exist')
    })

    //Test will fail if empty user has been already registered
    it("should not log in without credentials", () => {
      login('', '')
      cy.get(HOME.LOGIN_MODAL.MESSAGE).should('have.text', TRANSLATION.LOGIN.INVALID_LOGIN)
      cy.get(HOME.MAIN_PAGE.LOGGEDIN_LINK).should('not.exist')
    })
  })
})
