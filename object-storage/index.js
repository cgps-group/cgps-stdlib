const stream = require("node:stream");
const util = require("node:util");
const zlib = require("node:zlib");

const gunzip = require("gunzip-maybe");

const {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const config = require("../config/server-runtime-config.js").default;

const pipeline = util.promisify(stream.pipeline);

const client = new S3Client({
  region: config.storageRegion,
  credentials: {
    accessKeyId: config.storageKey,
    secretAccessKey: config.storageSecret,
  },
  endpoint: config.storageEndpoint,
  forcePathStyle: config.storageForcePathStyle,
});

async function exists(bucket, key) {
  const input = {
    Bucket: bucket,
    Key: key,
  };
  const command = new HeadObjectCommand(input);
  try {
    const res = await client.send(command);
    return res.ContentLength > 20;
  }
  catch (err) {
    if (err.name === "NotFound") {
      return false;
    }
    throw err;
  }
}

async function generateUrl(bucket, key) {
  const url = new URL(
    `${bucket}/${key}`,
    config.storageEndpoint,
  );
  return url.href;
}

async function generateSignedGetUrl(bucket, key, expiresInHours = 1) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return getSignedUrl(
    client,
    command,
    { expiresIn: expiresInHours * 3600 },
  );
}

async function generateSignedUploadUrl(
  bucket,
  key,
  expiresInHours = 1,
  metadata,
) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Metadata: metadata,
  });
  return getSignedUrl(
    client,
    command,
    { expiresIn: expiresInHours * 3600 },
  );
}

async function store(
  bucket,
  key,
  data,
  compress = false,
  options = {}
) {
  const passThroughStream = new stream.PassThrough();

  const uploadsRequest = new Upload({
    client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: passThroughStream,
      ACL: config.storageACL,
      ...options,
    },
  });

  if (compress) {
    pipeline(
      data,
      zlib.createGzip(),
      passThroughStream
    );
  }
  else {
    pipeline(
      data,
      passThroughStream
    );
  }

  return uploadsRequest.done();
}

async function head(bucket, key) {
  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const response = await client.send(command);
  return response;
}

async function getMetadata(bucket, key) {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await client.send(command);
    return response.Metadata;
  }
  catch (err) {
    if (err.name === "NotFound") {
      return false;
    }
    throw err;
  }
}

async function setMetadata(bucket, key, metadata) {
  const command = new CopyObjectCommand({
    Bucket: bucket,
    CopySource: `/${bucket}/${key}`,
    Key: key,
    MetadataDirective: "REPLACE",
    ...metadata,
  });

  return client.send(command);
}

async function retrieve(bucket, key, decompress = false) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const response = await client.send(command);

  if (decompress) {
    return response.Body.pipe(gunzip());
  }
  else {
    return response.Body;
  }
}

async function move(bucket, sourceKey, targetKey) {
  const copyCommand = new CopyObjectCommand({
    Bucket: bucket,
    CopySource: `/${bucket}/${sourceKey}`,
    Key: targetKey,
  });
  await client.send(copyCommand);

  const deleteCommand = new DeleteObjectCommand({
    Bucket: bucket,
    Key: sourceKey,
  });
  await client.send(deleteCommand);
}

async function listObjects(
  bucket,
  prefix,
) {
  const allObjects = [];
  let continuationToken;

  try {
    do {
      const params = {
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
        Prefix: prefix,
      };

      const data = await client.send(new ListObjectsV2Command(params));
      const keys = (data.Contents || []).map(object => object.Key);
      allObjects.push(...keys);

      continuationToken = data.NextContinuationToken;
    }
    while (continuationToken);
    return allObjects;

  }
  catch (error) {
    console.error("Error fetching objects:", error);
  }
}

async function deleteObject(bucket, key) {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await client.send(deleteCommand);
}

async function copyObject(bucket, sourceKey, targetKey, options = {}) {
  const copyCommand = new CopyObjectCommand({
    Bucket: bucket,
    CopySource: `/${bucket}/${sourceKey}`,
    Key: targetKey,
    ...options,
  });
  await client.send(copyCommand);
}

module.exports = {
  exists,
  generateSignedGetUrl,
  generateSignedUploadUrl,
  generateUrl,
  getMetadata,
  setMetadata,
  move,
  retrieve,
  store,
  deleteObject,
  copyObject,
  listObjects,
  head,
};
