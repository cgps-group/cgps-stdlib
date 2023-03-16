import shortUUID from "short-uuid";

/**
 * Generates an UUID string
 * @returns {string} UUID string
 */
export default function generateShortUUID() {
  return shortUUID.generate();
}
