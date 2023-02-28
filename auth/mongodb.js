/* eslint-disable import/no-mutable-exports */
// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
const { MongoClient } = require("mongodb");

const getConfig = require("next/config").default;

const { serverRuntimeConfig } = getConfig();

const uri = serverRuntimeConfig.mongodb.url;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please set Mongodb URI.");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}
else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
module.exports = clientPromise;
