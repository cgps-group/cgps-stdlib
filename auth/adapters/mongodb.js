import { MongoDBAdapter as createMongoDBAdapter } from "@next-auth/mongodb-adapter";

import clientPromise from "cgps-stdlib/db/mongodb-connect.js";

export default (
  createMongoDBAdapter(
    clientPromise()
      .then((x) => x.connection.client)
  )
);
