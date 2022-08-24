import { 
  openLoginModal,
  login,
  logout
 } from '../../support/pages/home'
import { HOME } from '../../custom/locators/home'
import { TRANSLATION } from '../../custom/translation/strings'

context("Log in an existing user", () => {
  describe("Scenario - Successful login using top container", () => {
    it("should open Login modal", () => {
        openLoginModal()
        cy.get(HOME.LOGIN_MODAL.HEADER).should('be.visible').and('have.text', TRANSLATION.LOGIN.HEADER)
        cy.get(HOME.LOGIN_MODAL.USERNAME).invoke('attr', 'placeholder').should('equal', TRANSLATION.LOGIN.USERNAME)
        cy.get(HOME.LOGIN_MODAL.PASSWORD).invoke('attr', 'placeholder').should('equal', TRANSLATION.LOGIN.PASSWORD)
        cy.get(HOME.LOGIN_MODAL.MODAL).find(HOME.LOGIN_MODAL.LOGIN_BUTTON).should('contain.text', TRANSLATION.LOGIN.LOGIN_BUTTON)
    })

    it("should log in", () => {
      cy.fixture('/testdata/users').then(users => {
        const username = users.user.name
        login(username, users.user.password)
        //Confirm successful message
        cy.get(HOME.LOGIN_MODAL.MESSAGE).should('have.text', TRANSLATION.LOGIN.SUCCESSFUL_MESSAGE)
        //Confirm user is logged in & account menu is available & 'log in' link is no longer visible
        cy.get(HOME.MAIN_PAGE.LOGGEDIN_LINK).should($text => {
          expect($text.text().toLowerCase()).to.contain(`${TRANSLATION.LOGIN.LOGGED_IN} ${username}`)
        })
        cy.get(HOME.MAIN_PAGE.ACCOUNT_TAB).should('be.visible')
        cy.get(HOME.MAIN_PAGE.LOGIN_LINK).should('not.exist')
      })
    })

    it("should log out", () => {
      cy.get('body').then($body => {
        if (!$body.find(HOME.MAIN_PAGE.LOGGEDIN_LINK).length) {
          cy.fixture('/testdata/users').then(users => {
            login(users.user.name, users.user.password)
          })
        }
      })
      logout()
      //Confirm user is logged out & account menu is not available
      cy.get(HOME.MAIN_PAGE.LOGIN_LINK).should('be.visible')
      cy.get(HOME.MAIN_PAGE.ACCOUNT_TAB).should('not.exist')
    })

    it("should log out and log another user in", () => {
      cy.fixture('/testdata/users').then(users => {
        const username1 = users.user1.name
        login(users.user.name, users.user.password)
        logout()
        login(username1, users.user.password)
        //Confirm user is logged in & account menu is available
        cy.get(HOME.MAIN_PAGE.LOGGEDIN_LINK).should($text => {
          expect($text.text().toLowerCase()).to.contain(`${TRANSLATION.LOGIN.LOGGED_IN} ${username1}`)
        })
        cy.get(HOME.MAIN_PAGE.ACCOUNT_TAB).should('be.visible')
      })
    })
  })

  describe("Scenario - Unsuccessful login using top container", () => {
    before(() => {
      //log out if already logged in
      cy.get('body').then($body => {
        if ($body.find(HOME.MAIN_PAGE.LOGOUT_LINK).length) {
          logout()
        }
      })
    })

    it("should not log in if user does not exist", () => {
      cy.fixture('/testdata/users').then(users => {
        login(users.fake.name, users.fake.password)
        //Confirm user is logged in & account menu is available
        cy.get(HOME.LOGIN_MODAL.MESSAGE).should('have.text', TRANSLATION.LOGIN.INVALID_LOGIN)
        cy.get(HOME.MAIN_PAGE.LOGGEDIN_LINK).should('not.exist')
      })
    })

    it("should not log user in without password", () => {
      cy.fixture('/testdata/users').then(users => {
        login(users.fake.name, '')
        //Confirm user is logged in & account menu is available
        cy.get(HOME.LOGIN_MODAL.MESSAGE).should('have.text', TRANSLATION.LOGIN.INVALID_LOGIN)
        cy.get(HOME.MAIN_PAGE.LOGGEDIN_LINK).should('not.exist')
      })
    })

    //Test will fail if empty user has been already registered
    it("should not log in without credentials", () => {
      login('', '')
      cy.get(HOME.LOGIN_MODAL.MESSAGE).should('have.text', TRANSLATION.LOGIN.INVALID_LOGIN)
      cy.get(HOME.MAIN_PAGE.LOGGEDIN_LINK).should('not.exist')
    })
  })
})
