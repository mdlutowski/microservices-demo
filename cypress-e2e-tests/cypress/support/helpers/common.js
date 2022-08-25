export function getLastNumberInString(text) {
    //Replace all characters except digits & whitespace
    text = text.replace(/[^\d\s]+/g, '');
    //Take last number
    const expression = text.trim().match(/\d+$/)
    if (expression) {
        return parseInt(expression.join())
    }
    return 0
}