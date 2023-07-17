/* eslint-disable new-cap */

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

function createMongoDBAdapter(clientPromise) {
  return MongoDBAdapter(clientPromise);
}

export default createMongoDBAdapter;
