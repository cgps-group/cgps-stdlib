const options = {
  "secret": process.env.AUTH_SECRET,
};

if (process.env.AUTH_EMAIL) {
  options.email = {
    server: {
      host: process.env.AUTH_EMAIL_SERVER_HOST ?? process.env.EMAIL_SERVER_HOST,
      port: process.env.AUTH_EMAIL_SERVER_PORT ?? process.env.EMAIL_SERVER_PORT,
      auth: {
        user: process.env.AUTH_EMAIL_SERVER_AUTH_USER ?? process.env.EMAIL_SERVER_USER,
        pass: process.env.AUTH_EMAIL_SERVER_AUTH_PASS ?? process.env.EMAIL_SERVER_PASSWORD,
      },
    },
    from: process.env.AUTH_EMAIL_FROM ?? process.env.EMAIL_FROM,
  };
}

if (process.env.AUTH_GOOGLE) {
  options.google = {
    clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.AUTH_APPLE) {
  options.apple = {
    clientId: process.env.AUTH_APPLE_CLIENT_ID,
    clientSecret: process.env.AUTH_APPLE_CLIENT_SECRET,
  };
}

if (process.env.AUTH_AZURE_AD) {
  options["azure-ad"] = {
    clientId: process.env.AUTH_AZURE_AD_CLIENT_ID,
    clientSecret: process.env.AUTH_AZURE_AD_CLIENT_SECRET,
    // tenantId: process.env.AUTH_AZURE_AD_TENANT_ID,
  };
}

if (process.env.AUTH_FACEBOOK) {
  options.facebook = {
    clientId: process.env.AUTH_FACEBOOK_CLIENT_ID,
    clientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET,
  };
}

if (process.env.AUTH_TWITTER) {
  options.twitter = {
    clientId: process.env.AUTH_TWITTER_CLIENT_ID,
    clientSecret: process.env.AUTH_TWITTER_CLIENT_SECRET,
  };
}

if (process.env.AUTH_AZURE_AD_B2C) {
  options["azure-ad-b2c"] = {
    tenantId: process.env.AUTH_AZURE_AD_B2C_TENANT_NAME,
    clientId: process.env.AUTH_AZURE_AD_B2C_CLIENT_ID,
    clientSecret: process.env.AUTH_AZURE_AD_B2C_CLIENT_SECRET,
    primaryUserFlow: process.env.AUTH_AZURE_AD_B2C_PRIMARY_USER_FLOW,
  };
}

if (process.env.AUTH_BRYN) {
  options.bryn = {
    clientId: process.env.AUTH_BRYN_CLIENT_ID,
    clientSecret: process.env.AUTH_BRYN_CLIENT_SECRET,
  };
}

module.exports = options;
