const options = {
  "secret": process.env.AUTH_SECRET,
};

if (process.env.AUTH_GOOGLE) {
  options.google = {
    clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.AUTH_AZURE_AD) {
  options["azure-ad"] = {
    clientId: process.env.AUTH_AZURE_AD_CLIENT_ID,
    clientSecret: process.env.AUTH_AZURE_AD_CLIENT_SECRET,
    tenantId: process.env.AUTH_AZURE_AD_TENANT_ID,
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
