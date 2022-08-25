import {
  openRegisterModal,
  logout,
  logoutIfLoggedIn,
  register,
} from "../../support/pages/home";
import { HOME } from "../../custom/locators/home";
import { TRANSLATION } from "../../custom/translation/strings";
import dayjs from "dayjs";

context("Register a new user", () => {
  before(() => {
    logoutIfLoggedIn();
  });

  describe("Scenario - Successful registration as a new user", () => {
    it("should open Register modal", () => {
      openRegisterModal();
      cy.get(HOME.REGISTER_MODAL.MODAL)
        .find(HOME.REGISTER_MODAL.HEADER)
        .should("have.text", TRANSLATION.REGISTER.HEADER);
      cy.get(HOME.REGISTER_MODAL.USERNAME)
        .invoke("attr", "placeholder")
        .should("equal", TRANSLATION.REGISTER.USERNAME);
      cy.get(HOME.REGISTER_MODAL.FIRST_NAME)
        .invoke("attr", "placeholder")
        .should("equal", TRANSLATION.REGISTER.FIRST_NAME);
      cy.get(HOME.REGISTER_MODAL.LAST_NAME)
        .invoke("attr", "placeholder")
        .should("equal", TRANSLATION.REGISTER.LAST_NAME);
      cy.get(HOME.REGISTER_MODAL.EMAIL)
        .invoke("attr", "placeholder")
        .should("equal", TRANSLATION.REGISTER.EMAIL);
      cy.get(HOME.REGISTER_MODAL.PASSWORD)
        .invoke("attr", "placeholder")
        .should("not.exist");
      cy.get(HOME.REGISTER_MODAL.MODAL)
        .find(HOME.REGISTER_MODAL.REGISTER_BUTTON)
        .should("contain.text", TRANSLATION.REGISTER.REGISTER_BUTTON);
    });

    it("should register a new user", () => {
      const datetime = dayjs().format("YYMMDDhhmmss");
      const username = `username_${datetime}`;
      const firstName = `first_name_${datetime}`;
      const lastName = `last_name_${datetime}`;
      const email = `email${datetime}@test.com`;
      const password = `password_${datetime}`;

      register(username, firstName, lastName, email, password);
      //Confirm successful message
      cy.get(HOME.REGISTER_MODAL.MESSAGE).should(
        "have.text",
        TRANSLATION.REGISTER.SUCCESSFUL_MESSAGE
      );
      //Confirm user is logged in & account menu is available & 'log in' link is no longer visible
      cy.get(HOME.MAIN_PAGE.LOGGEDIN_LINK).should(
        "contain.text",
        `${TRANSLATION.LOGIN.LOGGED_IN} ${firstName} ${lastName}`
      );
      cy.get(HOME.MAIN_PAGE.ACCOUNT_TAB).should("be.visible");
      cy.get(HOME.MAIN_PAGE.LOGIN_LINK).should("not.exist");
    });
  });

  describe("Scenario - Unsuccessful registration", () => {
    before(() => {
      logout();
    });

    it("should not register existing user", () => {
      register(Cypress.config("mainUser"), "test", "test", "test", "test");
      //Confirm user is not registered in & account menu not is available
      cy.get(HOME.REGISTER_MODAL.MESSAGE).should(
        "have.text",
        TRANSLATION.REGISTER.INVALID_REGISTRATION
      );
      cy.get(HOME.MAIN_PAGE.LOGGEDIN_LINK).should("not.exist");
    });

    //Test fails, none of fields is mandatory, so it's possible to register user with invalid data
    it("should not register empty user", () => {
      register("", "", "", "", "");
      //Confirm user is not registered in & account menu not is available
      cy.get(HOME.REGISTER_MODAL.MESSAGE).should(
        "have.text",
        TRANSLATION.REGISTER.INVALID_REGISTRATION
      );
      cy.get(HOME.MAIN_PAGE.LOGGEDIN_LINK).should("not.exist");
      //clode modal
      cy.get(HOME.REGISTER_MODAL.MODAL)
        .find(HOME.REGISTER_MODAL.CLOSE_BUTTON)
        .click();
    });
  });
});
