import { BASKET } from '../../custom/locators/basket'
import { goToBasket } from '../../support/pages/home'

function clearBasket() {
  goToBasket()
  cy.wait(500)
  cy.get('body').then(($body) => {
    if ($body.find(BASKET.TRASH_ICON).length) {
      cy.get(BASKET.TRASH_ICON).click({ multiple: true, force: true })
    }
  })
}

function completeOrder(shouldComplete = true) {
  if (shouldComplete) {
    cy.setWaitWithAction('/orders', 'completeOrder', () => {
      cy.get(BASKET.ORDER_BUTTON).click()
    })
  } else {
    cy.get(BASKET.ORDER_BUTTON).click()
  }
}

export default {
  clearBasket,
  completeOrder,
}
