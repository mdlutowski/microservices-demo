import { HOME } from "../../custom/locators/home";
import { CATALOGUE } from "../../custom/locators/catalogue";
import { getAmountFromString } from "../helpers/common";

function waitForCataloguePage() {
  cy.get(CATALOGUE.MAIN_PAGE.PRODUCT_CONTAINERS)
    .filter(":visible")
    .should("have.length.at.least", 1);
}

function expandCatalogueDropdown() {
  cy.get(HOME.MAIN_PAGE.CATALOGUE_TAB)
    .trigger("mouseover")
    .find("a")
    .filter(":visible")
    .should("have.length.at.least", 2);
}

function sortProductsBy(option) {
  cy.get(CATALOGUE.MAIN_PAGE.SORT_BY_SELECT).select(option);
}

function applyFilterByName(filterName) {
  cy.get(CATALOGUE.FILTERS.SIDEBAR).find("input").check(filterName);
  cy.get(CATALOGUE.FILTERS.SIDEBAR)
    .find(CATALOGUE.FILTERS.APPLY_BUTTON)
    .click();
  waitForCataloguePage();
}

function clearFilter() {
  cy.get(CATALOGUE.FILTERS.SIDEBAR)
    .find(CATALOGUE.FILTERS.CLEAR_BUTTON)
    .click();
  waitForCataloguePage();
}

function addProductCheaperThanUserBudget(maxPrice) {
  cy.get(CATALOGUE.MAIN_PAGE.PRODUCT_CONTAINERS).each(($product) => {
    const productPrice = getAmountFromString(
      $product.find(CATALOGUE.MAIN_PAGE.PRODUCT_PRICE).text()
    );
    if (productPrice < maxPrice) {
      cy.setWaitWithAction("/cart", "updateBasket", () => {
        cy.wrap($product).find(CATALOGUE.MAIN_PAGE.ADD_TO_CART_BUTTON).click();
      });
      return false;
    }
  });
}

export default {
  waitForCataloguePage,
  expandCatalogueDropdown,
  sortProductsBy,
  applyFilterByName,
  clearFilter,
  addProductCheaperThanUserBudget,
};
