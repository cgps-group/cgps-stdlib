const stream = require("node:stream");
const util = require("node:util");
const zlib = require("node:zlib");
const { S3Client, GetObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage();
const config = require("../config/server-runtime-config.js");

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
async function existInGoogleCloud(bucket, key) {
  const [metadata] = await storage.bucket(bucket).file(key).getMetadata();
  if (metadata.id) {
    return true;
  }
  else
  {
    return false;
  }
}

async function existInAWS(bucket, key) {
  const input = {
    Bucket: bucket,
    Key: key,
  };
  const command = new HeadObjectCommand(input);
  let result = true;
  try { await client.send(command); }
  catch (err) {
    if (err.message === "UnknownError") {
      result = false;
    }
    else {
      throw err;
    }
  }
  return result;
}

async function storeinGoogleCloud(bucket, key, data, compress) {
  const passThroughStream = new stream.PassThrough();
  const myBucket = storage.bucket(bucket);
  const file = myBucket.file(key);
  if (compress) {
    pipeline(
      data,
      zlib.createGzip(),
      passThroughStream,
      file.createWriteStream()
    );
  }
  else {
    pipeline(
      data,
      passThroughStream,
      file.createWriteStream()
    );
  }
}

async function storeinAWS(bucket, key, data, compress) {
  const passThroughStream = new stream.PassThrough();
  const uploadsRequest = new Upload({
    client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: passThroughStream,
      ACL: "public-read",
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

async function exists(bucket, key) {
  let result;
  if (config.defaultRunner === "gc-batch") {
    result = await existInGoogleCloud(bucket, key);
  }
  else {
    result = await existInAWS(bucket, key);
  }
  return result;
}

async function generateUrl(bucket, key) {
  const url = new URL(
    `${bucket}/${key}`,
    config.storageEndpoint,
  );
  return url.href;
}

async function store(bucket, key, data, compress = false) {
  if (config.defaultRunner === "gc-batch") {
    await storeinGoogleCloud(bucket, key, data, compress);
  }
  else {
    await storeinAWS(bucket, key, data, compress);
  }
}

async function retrieve(bucket, key, decompress = false) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const response = await client.send(command);

  if (decompress) {
    return response.Body.pipe(zlib.createGunzip());
  }
  else {
    return response.Body;
  }
}

module.exports = {
  exists,
  generateUrl,
  store,
  retrieve,
};
