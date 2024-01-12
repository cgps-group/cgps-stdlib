import { init } from "@paralleldrive/cuid2";

const createId = init({
  length: 32,
});

/**
 * Generates an un-guessable secure string
 * @returns {string} Secure id
 * @see https://github.com/paralleldrive/cuid2
 */
export default function generateSecureId() {
  return createId();
}
