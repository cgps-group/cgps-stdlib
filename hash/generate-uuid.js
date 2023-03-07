import shortUUID from "short-uuid";

/**
 * Generates an UUID string
 * @returns {string} UUID string
 */
export default function generateUUID() {
  return shortUUID.generate();
}
