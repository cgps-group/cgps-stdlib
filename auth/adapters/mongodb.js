function createMongoDBAdapter() {
  const { MongoDBAdapter } = require("@next-auth/mongodb-adapter");
  const clientPromise = require("cgps-stdlib/db/mongodb-connect.js");
  // eslint-disable-next-line new-cap
  return MongoDBAdapter(clientPromise().then((x) => x.connection.client));
}

export default createMongoDBAdapter;
