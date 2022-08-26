import { HOME } from '../../custom/locators/home'
import { CATALOGUE } from '../../custom/locators/catalogue'
import { goToCatalogue } from '../../support/pages/home'
import {
  expandCatalogueDropdown,
  waitForCataloguePage,
  sortProductsBy,
  applyFilterByName,
  clearFilter,
} from '../../support/pages/catalogue'
import { getLastNumberInString } from '../../support/helpers/common'
import { TRANSLATION } from '../../custom/translation/strings'

context('Filter products', () => {
  before(() => {
    goToCatalogue()
  })

  describe('Filter products in catalogue', () => {
    //Test fails, sorting does not work
    it('should sort by name', () => {
      //Sort products ny name
      sortProductsBy(TRANSLATION.CATALOGUE.SELECT_NAME)
      //Create list of visible products & sort alphabetically
      let productNames = []
      cy.get(CATALOGUE.MAIN_PAGE.PRODUCT_CONTAINERS)
        .find('h3')
        .each(($productName) => {
          productNames.push($productName.text())
          productNames.sort()
        })
      //Compare sorted list with actual order
      cy.get(CATALOGUE.MAIN_PAGE.PRODUCT_CONTAINERS)
        .find('h3')
        .each(($productName, index) => {
          expect($productName.text()).to.equal(productNames[index])
        })
    })

    it('should set products number per page', () => {
      cy.get(CATALOGUE.MAIN_PAGE.TOTAL_PRODUCTS_TEXT)
        .as('productsText')
        .invoke('text')
        .then((totalText) => {
          const productsCount = getLastNumberInString(totalText)
          //Workaround to .each() - original elements are being destroyed during iterating over
          //Loop through page size buttons
          cy.get(CATALOGUE.MAIN_PAGE.SHOW_PRODUCTS_BUTTONS)
            .as('buttons')
            .then(($buttons) => {
              for (let i = 0; i < $buttons.length; i++) {
                cy.get('@buttons')
                  .eq(i)
                  .then(($button) => {
                    const paginatedProductsCount = $button.text()
                    cy.wrap($button).click()
                    waitForCataloguePage()
                    //Confirm that number of products is updated accordingly
                    cy.get(CATALOGUE.MAIN_PAGE.PRODUCT_CONTAINERS).should(
                      'have.length',
                      paginatedProductsCount
                    )
                    cy.get('@productsText').should(
                      'contain.text',
                      `${paginatedProductsCount} of ${productsCount}`
                    )
                  })
              }
            })
        })
    })

    it('should filter by products', () => {
      cy.get(CATALOGUE.MAIN_PAGE.TOTAL_PRODUCTS_TEXT)
        .as('productsText')
        .invoke('text')
        .then((originalTotalText) => {
          const originalProductsCount = getLastNumberInString(originalTotalText)
          //Apply filtering using sidebar & confirm new products count
          applyFilterByName(TRANSLATION.CATALOGUE.BROWN)
          cy.get('@productsText')
            .invoke('text')
            .then((filteredTotalText) => {
              expect(originalProductsCount).to.not.equal(
                getLastNumberInString(filteredTotalText)
              )
            })
          //Clear filtering & confirm the old products count is back
          clearFilter()
          cy.get('@productsText')
            .invoke('text')
            .then((clearedTotalText) => {
              expect(originalProductsCount).to.equal(
                getLastNumberInString(clearedTotalText)
              )
            })
        })
    })

    //Test fails, catalogue dropdown contains extra options
    it('should catalogue dropdown options be included in filer sidebar', () => {
      let filterOptions = []
      cy.get(CATALOGUE.FILTERS.SIDEBAR)
        .find('.checkbox')
        .each(($checkbox) => {
          filterOptions.push($checkbox.text())
        })
      expandCatalogueDropdown()
      cy.get(HOME.MAIN_PAGE.CATALOGUE_OPTIONS).each(($option) => {
        expect(filterOptions.join('')).to.contain($option.text().toLowerCase())
      })
    })
  })
})
