const CredentialsProvider = require("next-auth/providers/credentials").default;
const { UserRole } = require("@prisma/client");
const generateHashId = require("../../hash/generate-hash-id.js").default;

/**
 * Used to allow users to signin as a demo user with restricted privileges
 *
 * TODO: Add rate limiting
 *
 * @param {*} options
 * @param {*} adapter
 * @returns user
 */
module.exports = function (options, adapter) {
  return CredentialsProvider({
    id: options.id || "demo",
    name: options.name || 'a Demo Account',
    async authorize(credentials, req) {
      const username = `demo-user-${generateHashId(8)}`;
      const email = `${username}@demo.com`; // WHY: Required for session generation

      const user = await adapter.createUser({
        demo: true, // MAYBE: Pass in options?
        email,  // MAYBE: Pass in options?
        name: username,
        role: UserRole.basic,
      })

      return user
    }
  })
}
