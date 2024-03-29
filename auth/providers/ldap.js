/* eslint-disable new-cap */

const CredentialsProvider = require("next-auth/providers/credentials").default;
const LdapAuth = require("ldapauth-fork");

function normaliseImport(m) {
  return m.default ?? m;
}

const logger = normaliseImport(require("../../logger/index.js"));

function login(config, credentials) {
  const client = new LdapAuth(config);

  return new Promise((resolve) => {
    client.authenticate(
      credentials.username,
      credentials.password,
      (error, profile) => {
        if (error) {
          logger.error(error);
          resolve(null);
        }
        else {
          if (config.groupDn) {
            if (!profile._groups.some((x) => x.dn === config.groupDn)) {
              resolve(null);
            }
          }
          resolve(profile);
        }
      },
    );
  });
}

module.exports = function (options, adapter) {
  const config = {
    name: "LDAP",
    session: false,
    usernameField: "username",
    passwordField: "password",
    url: "ldap://localhost:389",
    bindDn: "cn=root",
    bindCredentials: "secret",
    searchBase: "ou=passport-ldapauth",
    searchFilter: "(uid={{username}})",
    searchAttributes: undefined,
    ...options,
  };

  return CredentialsProvider(
    {
      name: config.name,
      credentials: {
        username: { label: "Username", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Essentially promisify the LDAPJS client.bind function
        const profile = await login(config, credentials);

        logger.debug(
          {
            config: {
              ...config,
              "bindCredentials": "*".repeat(config?.bindCredentials?.length),
            },
            profile,
          },
          "ldap authorize",
        );

        if (profile === null) {
          return null;
        }

        const email = profile[config.emailAttribute || "mail"];
        const uid = profile[config.idAttribute || "uid"];
        const name = profile[config.nameAttribute || "displayName"];

        const userDoc = await adapter.getUserByEmail(email);
        if (userDoc) {
          userDoc.uid = uid;
          userDoc.name = name;
          return userDoc;
        }

        return adapter.createUser({
          email,
          uid,
          name,
        });
      },
    }
  );
};
