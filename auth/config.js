module.exports = {
  google: (
    (process.env.AUTH_GOOGLE_CLIENT_ID && process.env.AUTH_GOOGLE_CLIENT_SECRET)
      ?
      {
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
      }
      :
      undefined
  ),
  secret: process.env.AUTH_SECRET,
};
