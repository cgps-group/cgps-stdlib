import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

import config from"../config/server-runtime-config.js";

const client = new S3Client({
  region: config.storageRegion,
  credentials: {
    accessKeyId: config.storageKey,
    secretAccessKey: config.storageSecret,
  },
  endpoint: config.storageEndpoint,
  forcePathStyle: config.storageForcePathStyle,
});

export default client;