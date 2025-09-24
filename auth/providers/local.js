const os = require("node:os");

const CredentialsProvider = require("next-auth/providers/credentials").default;

function getUsername() {
  try {
    const u = os.userInfo().username; // cross-platform
    if (u) return u;
  } catch {} // can fail in some sandboxed envs

  // Fallback to env vars (Linux/macOS/Windows)
  return (
    process.env.LOGNAME ||
    process.env.USER ||
    process.env.LNAME ||
    process.env.USERNAME ||
    "unknown"
  );
}

module.exports = function (options, adapter) {
  const provider = CredentialsProvider({
    id: "local",
    name: "Local Account",
    async authorize(credentials, req) {
      const username = getUsername();
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
