/* eslint-disable new-cap */

import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import GitHubProvider from "next-auth/providers/github";
import AzureADProvider from "next-auth/providers/azure-ad";
import AppleProvider from "next-auth/providers/apple";

import { boolean } from "boolean";

import logger from "../logger/index.js";
import serverRuntimeConfig from "../config/server-runtime-config.js";

function createOptions(adapter) {
  const options = {
    callbackUrl: "/welcome",

    adapter,

    // logger,

    cookies: {
      pkceCodeVerifier: {
        name: "next-auth.pkce.code_verifier",
        options: {
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: true,
        },
      },
    },

    // @link https://next-auth.js.org/configuration/providers
    providers: [],

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
      signIn: async ({ user, account, profile, email }) => {
        logger.debug(
          { user, account, profile, email },
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
      colorScheme: "light",
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

  if (serverRuntimeConfig.auth.apple) {
    const appleLogo = (
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjQgMzIgMzc2LjQgNDQ5LjQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+CiAgPHRpdGxlPkFwcGxlIGljb248L3RpdGxlPgogIDxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0zMTguNyAyNjguN2MtLjItMzYuNyAxNi40LTY0LjQgNTAtODQuOC0xOC44LTI2LjktNDcuMi00MS43LTg0LjctNDQuNi0zNS41LTIuOC03NC4zIDIwLjctODguNSAyMC43LTE1IDAtNDkuNC0xOS43LTc2LjQtMTkuN0M2My4zIDE0MS4yIDQgMTg0LjggNCAyNzMuNXEwIDM5LjMgMTQuNCA4MS4yYzEyLjggMzYuNyA1OSAxMjYuNyAxMDcuMiAxMjUuMiAyNS4yLS42IDQzLTE3LjkgNzUuOC0xNy45IDMxLjggMCA0OC4zIDE3LjkgNzYuNCAxNy45IDQ4LjYtLjcgOTAuNC04Mi41IDEwMi42LTExOS4zLTY1LjItMzAuNy02MS43LTkwLTYxLjctOTEuOXptLTU2LjYtMTY0LjJjMjcuMy0zMi40IDI0LjgtNjEuOSAyNC03Mi41LTI0LjEgMS40LTUyIDE2LjQtNjcuOSAzNC45LTE3LjUgMTkuOC0yNy44IDQ0LjMtMjUuNiA3MS45IDI2LjEgMiA0OS45LTExLjQgNjkuNS0zNC4zeiIvPgo8L3N2Zz4="
    );
    options.providers.push(
      AppleProvider({
        "name": "Apple",
        "style": {
          "bg": "#ffffff",
          "text": "#000000",
          "logo": appleLogo,
        },
        ...serverRuntimeConfig.auth.apple,
      })
    );
  }

  if (serverRuntimeConfig.auth["azure-ad"]) {
    const microsoftLogo = (
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIH" +
      "dpZHRoPScyMScgaGVpZ2h0PScyMSc+PHBhdGggZmlsbD0nI2YyNTAyMicgZD0nTTEgMWg5djlIMXonLz" +
      "48cGF0aCBmaWxsPScjMDBhNGVmJyBkPSdNMSAxMWg5djlIMXonLz48cGF0aCBmaWxsPScjN2ZiYTAwJy" +
      "BkPSdNMTEgMWg5djloLTl6Jy8+PHBhdGggZmlsbD0nI2ZmYjkwMCcgZD0nTTExIDExaDl2OWgtOXonLz" +
      "48L3N2Zz4="
    );
    options.providers.push(
      AzureADProvider({
        "name": "Microsoft",
        "style": {
          "text": "#000000",
          "bg": "#ffffff",
          "logo": microsoftLogo,
        },
        "authorization": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
        "token": "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        ...serverRuntimeConfig.auth["azure-ad"],
      })
    );
  }

  // if (serverRuntimeConfig.auth["azure-ad-b2c"]) {
  //   options.providers.push(
  //     AzureADB2CProvider({
  //       name: "Microsoft",
  //       style: {
  //         text: "black",
  //         textDark: "white",
  //         logo: microsoftLogo,
  //         logoDark: microsoftLogo,
  //       },
  //       authorization: { params: { scope: "openid profile email" } },
  //       ...serverRuntimeConfig.auth["azure-ad-b2c"],
  //     }),
  //     // AzureADB2CProvider({
  //     //   ...serverRuntimeConfig.auth["azure-ad-b2c"],
  //     //   clientId: process.env.AZURE_CLIENT_ID,
  //     //   clientSecret: process.env.AZURE_CLIENT_SECRET,
  //     //   scope: `openid profile email ${process.env.AZURE_SCOPE}`,
  //     //   tenantId: process.env.AZURE_TENANT_ID,
  //     //   idToken: true,
  //     //   profile(profile) {
  //     //     return {
  //     //       id: profile.oid,
  //     //       name: profile.name,
  //     //       email: profile.email,
  //     //     };
  //     //   },
  //     // })
  //   );
  // }

  if (serverRuntimeConfig.auth.facebook) {
    const facebookLogo = `data:image/svg+xml;base64,PHN2ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgc2hhcGUtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIHRleHQtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIHZpZXdCb3g9IjY3MDIuNzcgMTgzMDkuMTcgNjU2MS42NiA2NTYxLjY2MDAwMDAwMDAwNyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNOTk4My42IDE4MzA5LjE3YzE4MTEuOTUgMCAzMjgwLjgzIDE0NjguODggMzI4MC44MyAzMjgwLjgzcy0xNDY4Ljg4IDMyODAuODMtMzI4MC44MyAzMjgwLjgzUzY3MDIuNzcgMjM0MDEuOTUgNjcwMi43NyAyMTU5MHMxNDY4Ljg4LTMyODAuODMgMzI4MC44My0zMjgwLjgzeiIgZmlsbD0iIzAwNmFmZiIvPgogIDxwYXRoIGQ9Ik0xMDQwOS44OSAyNDg0My4yOXYtMjUzNC4xN2g3MTQuNDNsOTQuNy04OTEuOTFoLTgwOS4xM2wxLjItNDQ2LjQ0YzAtMjMyLjYzIDIyLjEtMzU3LjIyIDM1Ni4yNC0zNTcuMjJoNDQ2LjY4di04OTIuMDZoLTcxNC41OWMtODU4LjM1IDAtMTE2MC40MiA0MzIuNjUtMTE2MC40MiAxMTYwLjM0djUzNS40NWgtNTM1LjA3djg5MS45OUg5MzM5djI0OTguMDljMjA4LjQ1IDQxLjUzIDQyMy45NSA2My40NyA2NDQuNiA2My40N2EzMzEwLjkgMzMxMC45IDAgMCAwIDQyNi4yOS0yNy41NHoiIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0ibm9uemVybyIvPgo8L3N2Zz4=`;
    options.providers.push(
      FacebookProvider({
        "style": {
          "text": "#000000",
          "bg": "#ffffff",
          "logo": facebookLogo,
        },
        ...serverRuntimeConfig.auth.facebook,
      })
    );
  }

  if (serverRuntimeConfig.auth.twitter) {
    const twitterLogo = (
      "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHZpZXdCb3g9IjAgMCAyNDggMjA0Ij4KICA8cGF0aCBmaWxsPSIjMWQ5YmYwIiBkPSJNMjIxLjk1IDUxLjI5Yy4xNSAyLjE3LjE1IDQuMzQuMTUgNi41MyAwIDY2LjczLTUwLjggMTQzLjY5LTE0My42OSAxNDMuNjl2LS4wNGMtMjcuNDQuMDQtNTQuMzEtNy44Mi03Ny40MS0yMi42NCAzLjk5LjQ4IDggLjcyIDEyLjAyLjczIDIyLjc0LjAyIDQ0LjgzLTcuNjEgNjIuNzItMjEuNjYtMjEuNjEtLjQxLTQwLjU2LTE0LjUtNDcuMTgtMzUuMDcgNy41NyAxLjQ2IDE1LjM3IDEuMTYgMjIuOC0uODctMjMuNTYtNC43Ni00MC41MS0yNS40Ni00MC41MS00OS41di0uNjRjNy4wMiAzLjkxIDE0Ljg4IDYuMDggMjIuOTIgNi4zMkMxMS41OCA2My4zMSA0Ljc0IDMzLjc5IDE4LjE0IDEwLjcxYzI1LjY0IDMxLjU1IDYzLjQ3IDUwLjczIDEwNC4wOCA1Mi43Ni00LjA3LTE3LjU0IDEuNDktMzUuOTIgMTQuNjEtNDguMjUgMjAuMzQtMTkuMTIgNTIuMzMtMTguMTQgNzEuNDUgMi4xOSAxMS4zMS0yLjIzIDIyLjE1LTYuMzggMzIuMDctMTIuMjYtMy43NyAxMS42OS0xMS42NiAyMS42Mi0yMi4yIDI3LjkzIDEwLjAxLTEuMTggMTkuNzktMy44NiAyOS03Ljk1LTYuNzggMTAuMTYtMTUuMzIgMTkuMDEtMjUuMiAyNi4xNnoiLz4KPC9zdmc+"
    );
    options.providers.push(
      TwitterProvider({
        name: "Twitter",
        style: {
          "text": "#000000",
          "bg": "#ffffff",
          "logo": twitterLogo,
        },
        ...serverRuntimeConfig.auth.twitter,
      })
    );
  }

  if (serverRuntimeConfig.auth.github) {
    options.providers.push(
      GitHubProvider(serverRuntimeConfig.auth.github)
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
    const brynLogo = (
      "data:image/png;base64,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eGl2MiI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAub3JnL3htcC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjVlZDNmMDhmLTljZWEtNGI5Yy05NDBhLWU2YTkyMzg5YzA4MiIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3NzQ4NWZlYi1mNjgzLTQ2Y2QtOTI3NC01YmFkOWE4OGNkYWIiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiNTJmMGYyZi0wMDBiLTQ1ZWUtYWU3NS02YWY5NTAxMzkxZDAiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBHSU1QOkFQST0iMi4wIgogICBHSU1QOlBsYXRmb3JtPSJNYWMgT1MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNzExMTE5Nzc5MTczNjAwIgogICBHSU1QOlZlcnNpb249IjIuMTAuMzIiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0OjAzOjIyVDE1OjAyOjU5KzAwOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyNDowMzoyMlQxNTowMjo1OSswMDowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBmOWQyYzg0LTMxNzEtNDk3MS04NjI4LTJhNGQ4ZDc0NWI4OSIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChNYWMgT1MpIgogICAgICBzdEV2dDp3aGVuPSIyMDI0LTAzLTIyVDE1OjAyOjU5KzAwOjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pug9KUEAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfoAxYPAjuMcI1HAAAHHklEQVR42u3cXUhTbQAH8H/N1LQtrCwzKx2abl4UGfY1MAmVrIvYRbWgLxAMESrIvkaEF5maMKykG4XyJqFEKNEKzAUZXhR4MauZVNRsbdqHI6bmlu/Fyyv1buecbW7Lve//d7dzznOe8/H3+doQICIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiohCak5ubO8XHQAAwl4+AGAZiGIhhIIaBGAZiGIhhIIaBGAZiGIhhoDCKCrRgWVkZdDodoqOjfS7jcrkwMjICm82GoaEhtLa2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"
    );
    options.providers.push({
      "name": "CLIMB",
      "style": {
        "text": "#000000",
        "bg": "#ffffff",
        "logo": brynLogo,
      },
      "id": "bryn",
      "type": "oauth",
      "wellKnown": "https://bryn.climb.ac.uk/o/.well-known/openid-configuration/",
      "clientId": serverRuntimeConfig.auth.bryn.clientId,
      "clientSecret": serverRuntimeConfig.auth.bryn.clientSecret,
      "authorization": { params: { scope: "openid email profile groups" } },
      profile(profile) {
        logger.debug(
          { profile },
          "profile to user",
        );
        return {
          id: profile[options.idAttribute ?? "sub"],
          name: profile[options.nameAttribute ?? "name"],
          email: profile[options.emailAttribute ?? "email"],
          groups: profile[options.groupsAttribute ?? "groups"],
        };
      },
    });
  }

  return options;
}

export default createOptions;
