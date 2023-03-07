/**
 * Generates a hash string of specified length
 * @param {number} count
 * @returns {string} hash string
 */
export default function generateHashId(count = 4) {
  return (
    Math.random()
      .toString(36)
      .substr(2, count)
  );
}
