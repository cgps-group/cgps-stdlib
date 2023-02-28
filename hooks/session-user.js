const { signIn, useSession } = require("next-auth/react");

module.exports = function sessionUser(isRequired) {
  const { data, status } = useSession({
    required: isRequired || false,
    onUnauthenticated: signIn,
  });
  if (status === "loading" || status === "unauthenticated") {
    return status;
  }
  return data.user;
};
