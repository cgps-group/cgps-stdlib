/* eslint-disable new-cap */

import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import GitHubProvider from "next-auth/providers/github";
import AzureADProvider from "next-auth/providers/azure-ad";
import { boolean } from "boolean";

import logger from "../logger/index.js";
import serverRuntimeConfig from "../config/server-runtime-config.js";

function createOptions(adapter) {
  const options = {
    callbackUrl: "/welcome",

    adapter,

    // logger,

    // @link https://next-auth.js.org/configuration/providers
    providers: [
    ],

    // @link https://next-auth.js.org/configuration/options#session
    session: {
      // Use JSON Web Tokens for session instead of database sessions.
      // This option can be used with or without a database for users/accounts.
      // Note: `jwt` is automatically set to `true` if no database is specified.
      strategy: "jwt",

      // Seconds - How long until an idle session expires and is no longer valid.
      maxAge: (serverRuntimeConfig.auth.maxAge ?? (14 * 24 * 60)) * 60, // 14 days

      // Seconds - Throttle how frequently to write to database to extend a session.
      // Use it to limit write operations. Set to 0 to always update the database.
      // Note: This option is ignored if using JSON Web Tokens
      updateAge: 24 * 60 * 60, // 24 hours
    },

    // @link https://next-auth.js.org/configuration/options#jwt
    jwt: {
      // A secret to use for key generation - you should set this explicitly
      // Defaults to NextAuth.js secret if not explicitly specified.
      secret: serverRuntimeConfig.auth.secret,

      // Set to true to use encryption. Defaults to false (signing only).
      encryption: true, // Very important to encrypt the JWT, otherwise you're leaking username+password into the browser

      // You can define your own encode/decode functions for signing and encryption
      // if you want to override the default behaviour.
      // encode: async ({ secret, token, maxAge }) => {},
      // decode: async ({ secret, token, maxAge }) => {},
    },

    // @link https://next-auth.js.org/configuration/callbacks
    callbacks: {
      /**
       * Intercept signIn request and return true if the user is allowed.
       *
       * @link https://next-auth.js.org/configuration/callbacks#sign-in-callback
       * @param  {object} user     User object
       * @param  {object} account  Provider account
       * @param  {object} profile  Provider profile
       * @return {boolean}         Return `true` (or a modified JWT) to allow sign in
       *                           Return `false` to deny access
       */
      signIn: async ({ user, account, profile, email, credentials }) => {
        logger.debug(
          { user, account, profile, email, credentials },
          "signin",
        );
        if (serverRuntimeConfig.auth.allowedUsers && !serverRuntimeConfig.auth.allowedUsers.includes(user.email)) {
          return false;
        }
        if (account.provider === "openidconnect" && Array.isArray(serverRuntimeConfig.auth.openidconnect.checks)) {
          const ckecks = serverRuntimeConfig.auth.openidconnect.checks;
          const passed = ckecks.every((x) => boolean(profile[x]));
          return passed;
        }
        return true;
      },

      /**
       * @link https://next-auth.js.org/configuration/callbacks#session-callback
       * @param  {object} session      Session object
       * @param  {object} user         User object    (if using database sessions)
       * @param  {object} token        JSON Web Token (if not using database sessions)
       * @return {object}              Session that will be returned to the client
       */
      session: async ({ session, token, user }) => {
        session.user.id = (token || user).id;

        const userDoc = await adapter.getUser(session.user.id);
        if (!userDoc) {
          // User was removed from DB after token creation
          return null;
        }

        return Promise.resolve(session);
      },

      /**
       * @link https://next-auth.js.org/configuration/callbacks#jwt-callback
       * @param  {object}  token     Decrypted JSON Web Token
       * @param  {object}  user      User object      (only available on sign in)
       * @param  {object}  account   Provider account (only available on sign in)
       * @param  {object}  profile   Provider profile (only available on sign in)
       * @param  {boolean} isNewUser True if new user (only available on sign in)
       * @return {object}            JSON Web Token that will be saved
       */
      jwt: async ({ token, user, account, profile, isNewUser }) => {
        const isSignIn = !!user;
        if (isSignIn) {
          token.id = user.id;
        }
        return Promise.resolve(token);
      },

      /**
       * @param  {string} url      URL provided as callback URL by the client
       * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
       * @return {string}          URL the client will be redirect to
       */
      async redirect({ url, baseUrl }) {
        if (url.startsWith(baseUrl) || url.startsWith("/")) {
          return url;
        }
        else {
          return baseUrl;
        }
      },
    },

    events: {
      signIn: ({ user, account, profile, isNewUser, req }) => {
        logger.info(
          {
            email: profile?.email || undefined,
            provider: account?.provider || undefined,
            req,
            user,
            username: profile?.username || undefined,
          },
          "user signin",
        );
      },
      signOut({ token, session }) {
        logger.info(
          { token },
          "user signout",
        );
      },
    },

    // pages: {
    //   signIn: "/auth/signin",
    // },

    theme: {
      brandColor: "#3d7484",
      colorScheme: "auto",
      ...serverRuntimeConfig.auth.theme,
    },

    // Additional options
    secret: serverRuntimeConfig.auth.secret,
    // debug: true, // Use this option to enable debug messages in the console
  };

  if (serverRuntimeConfig.auth.email) {
    options.providers.push(
      EmailProvider(serverRuntimeConfig.auth.email),
    );
  }

  if (serverRuntimeConfig.auth.google) {
    options.providers.push(
      GoogleProvider(serverRuntimeConfig.auth.google)
    );
  }

  if (serverRuntimeConfig.auth.facebook) {
    options.providers.push(
      FacebookProvider(serverRuntimeConfig.auth.facebook)
    );
  }

  if (serverRuntimeConfig.auth.twitter) {
    options.providers.push(
      TwitterProvider(serverRuntimeConfig.auth.twitter)
    );
  }

  if (serverRuntimeConfig.auth.github) {
    options.providers.push(
      GitHubProvider(serverRuntimeConfig.auth.github)
    );
  }

  if (serverRuntimeConfig.auth["azure-ad"]) {
    options.providers.push(
      AzureADProvider(serverRuntimeConfig.auth["azure-ad"])
    );
  }

  if (serverRuntimeConfig.auth.ldap) {
    const createLdapProvider = require("./providers/ldap.js");
    options.providers.push(
      createLdapProvider(
        serverRuntimeConfig.auth.ldap,
        adapter,
      )
    );
  }

  if (serverRuntimeConfig.auth.openidconnect) {
    const createOpenIDConnectProvider = require("./providers/openidconnect.js");
    options.providers.push(
      createOpenIDConnectProvider(serverRuntimeConfig.auth.openidconnect)
    );
  }

  if (serverRuntimeConfig.auth.bryn) {
    options.providers.push({
      name: "CLIMB",
      id: "bryn",
      type: "oauth",
      wellKnown: "https://bryn.climb.ac.uk/o/.well-known/openid-configuration/",
      clientId: serverRuntimeConfig.auth.bryn.clientId,
      clientSecret: serverRuntimeConfig.auth.bryn.clientSecret,
      authorization: { params: { scope: "openid email profile groups" } },
      profile(profile) {
        logger.debug(
          { profile },
          "profile to user",
        );
        return {
          id: profile[options.idAttribute ?? "sub"],
          name: profile[options.nameAttribute ?? "name"],
          email: profile[options.emailAttribute ?? "email"],
        };
      },
    });
  }

  return options;
}

export default createOptions;
