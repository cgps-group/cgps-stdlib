/* eslint-disable new-cap */

const { MongoDBAdapter } = require("@next-auth/mongodb-adapter");

const clientPromise = require("./mongodb");

module.exports = MongoDBAdapter(clientPromise);
