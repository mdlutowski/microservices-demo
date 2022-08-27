export function getLastNumberInString(text) {
  //Replace all characters except digits & whitespace
  text = text.replace(/[^\d\s]+/g, '')
  //Take last number
  const expression = text.trim().match(/\d+$/)
  if (expression) {
    return parseInt(expression.join())
  }
  return 0
}

export function getAmountFromString(text) {
  let expression = text.trim().match(/\d+\.\d{2}/)
  if (expression) {
    return parseFloat(expression.join())
  }
  return 0
}

export function parseAmount(amount) {
  return parseFloat(amount.toFixed(2))
}
