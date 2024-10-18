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

async function generateSignedUploadUrl(bucket, key, expiresInHours = 1) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
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
) {
  const passThroughStream = new stream.PassThrough();

  const uploadsRequest = new Upload({
    client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: passThroughStream,
      ACL: config.storageACL,
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

module.exports = {
  exists,
  generateSignedGetUrl,
  generateSignedUploadUrl,
  generateUrl,
  retrieve,
  store,
  move,
};
