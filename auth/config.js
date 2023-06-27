module.exports = {
  google: (
    (process.env.AUTH_GOOGLE)
      ?
      {
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
      }
      :
      undefined
  ),
  bryn: (
    (process.env.AUTH_BRYN)
      ?
      {
        clientId: process.env.AUTH_BRYN_CLIENT_ID,
        clientSecret: process.env.AUTH_BRYN_CLIENT_SECRET,
      }
      :
      undefined
  ),
  secret: process.env.AUTH_SECRET,
};
