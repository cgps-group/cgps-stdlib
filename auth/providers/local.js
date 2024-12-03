const CredentialsProvider = require("next-auth/providers/credentials").default;

module.exports = function (options, adapter) {
  const provider = CredentialsProvider({
    id: "local",
    name: "Local Account",
    async authorize(credentials, req) {
      const username = options.username;
      const email = `${username}@pathogenwatch.local`;
    
      let user = await adapter.getUserByEmail(email);
      if (!user) {
        user = await adapter.createUser({
          email,
          name: username,
        });
      }

      return user
    }
  })

  return {
    ...provider,
    id: provider.options.id
  }
}
