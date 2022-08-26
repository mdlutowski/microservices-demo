import { HOME } from '../../custom/locators/home'
import { BASKET } from '../../custom/locators/basket'
import { ORDERS } from '../../custom/locators/my_orders'
import { goToCatalogue } from '../../support/pages/home'
import { login, logoutIfLoggedIn, goToBasket } from '../../support/pages/home'
import { addProductCheaperThanUserBudget } from '../../support/pages/catalogue'
import { clearBasket, completeOrder } from '../../support/pages/basket'
import {
  storeSession,
  getAmountFromString,
  parseAmount,
} from '../../support/helpers/common'
import { TRANSLATION } from '../../custom/translation/strings'
import dayjs from 'dayjs'

context('Order products', () => {
  before(() => {
    cy.reload()
    login(Cypress.config('mainUser'), Cypress.config('mainPassword'))
    cy.get(HOME.LOGIN_MODAL.MODAL).should('be.not.visible')
  })

  beforeEach(() => {
    storeSession()
    clearBasket()
    goToCatalogue()
  })

  describe('Order a product from catalogue', () => {
    it('should order a product', () => {
      addProductCheaperThanUserBudget(50)
      goToBasket()
      //Confirm only 1 product is in basket
      cy.get(HOME.MAIN_PAGE.BASKET_BUTTON)
        .find('span')
        .should('have.text', `1 ${TRANSLATION.BASKET.BASKET_TEXT}`)
      //Confirm basket total matches order total
      cy.get(BASKET.CART_TOTAL).then(($cartTotal) => {
        const cartTotal = getAmountFromString($cartTotal.text())
        cy.get(BASKET.ORDER_SUBTOTAL).then(($orderSubtotal) => {
          const orderSubtotal = getAmountFromString($orderSubtotal.text())
          cy.get(BASKET.ORDER_SHIPPING).then(($orderShipping) => {
            const orderShipping = getAmountFromString($orderShipping.text())
            cy.get(BASKET.ORDER_TOTAL).then(($orderTotal) => {
              const orderTotal = getAmountFromString($orderTotal.text())
              expect(cartTotal).to.equal(orderSubtotal)
              expect(orderShipping).to.equal(TRANSLATION.BASKET.SHIPPING_COST)
              expect(orderTotal).to.eq(
                parseAmount(orderSubtotal + orderShipping)
              )
              //Finalize order
              completeOrder()
              //Confirm order is visible on customer account
              cy.get(ORDERS.TABLE_ORDERS)
                .find('tr')
                .last()
                .find('th,td')
                .should(($cells) => {
                  expect($cells.eq(0).text()).to.match(/^# \w*$/)
                  expect($cells.eq(1).text()).to.contain(
                    dayjs().format('YYYY-MM-DD')
                  )
                  expect($cells.eq(2).text()).to.equal(`$ ${orderTotal}`)
                  expect($cells.eq(3).text().trim()).to.equal(
                    TRANSLATION.ORDERS.SHIPPED
                  )
                  expect($cells.eq(4).text().trim()).to.equal(
                    TRANSLATION.ORDERS.VIEW
                  )
                })
            })
          })
        })
      })
    })

    it('should order multiple product', () => {
      addProductCheaperThanUserBudget(40)
      addProductCheaperThanUserBudget(40)
      goToBasket()
      //Confirm 2 products are in basket
      cy.get(HOME.MAIN_PAGE.BASKET_BUTTON)
        .find('span')
        .should('have.text', `2 ${TRANSLATION.BASKET.BASKET_TEXT}`)
      //Confirm basket total matches double unit price
      cy.get(BASKET.CART_TOTAL).then(($cartTotal) => {
        const cartTotal = getAmountFromString($cartTotal.text())
        cy.get(BASKET.UNIT_PRICE).then(($unitPrice) => {
          const unitPrice = getAmountFromString($unitPrice.text())
          expect(cartTotal).to.equal(unitPrice * 2)
          //Finalize order
          completeOrder()
          //Confirm order table is loaded
          cy.get(ORDERS.TABLE_ORDERS).should('be.visible')
        })
      })
    })
  })

  describe('Fail to order product from catalogue', () => {
    it('should decline payment exceeding $100', () => {
      addProductCheaperThanUserBudget(100)
      goToBasket()
      completeOrder(false)
      cy.get(BASKET.NOTIFICATION).should(
        'contain.text',
        TRANSLATION.BASKET.TOO_HIGH_AMOUNT
      )
    })

    it('should fail to finalize order if shipping or payment information is missing', () => {
      logoutIfLoggedIn()
      goToCatalogue()
      addProductCheaperThanUserBudget(100)
      goToBasket()
      completeOrder(false)
      cy.get(BASKET.NOTIFICATION).should(
        'contain.text',
        TRANSLATION.BASKET.MISSING_INFORMATION
      )
    })
  })
})
