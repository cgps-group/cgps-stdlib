/**
 * Converts a value to a number.
 * @param {string} value A number or a string containing a numeric value.
 * @returns {string} A number if the input is a valid numeric value, otherwise `undefined`.
 */
function convertToNumber(value) {
  if (
    typeof value === "number"
    &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value === "string") {
    const number = parseFloat(value);
    if (
      !Number.isNaN(number)
      && Number.isFinite(number)
    ) {
      return number;
    }
  }

  return undefined;
}

export default convertToNumber;
