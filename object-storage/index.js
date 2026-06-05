import * as stream from "node:stream";
import * as util from "node:util";
import * as zlib from "node:zlib";

import gunzipMaybe from "gunzip-maybe";

import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import AWS from "aws-sdk";

import config from "../config/server-runtime-config.js";

const pipeline = util.promisify(stream.pipeline);
const gzip = util.promisify(zlib.gzip);
const gunzipBuffer = util.promisify(zlib.gunzip);

const client = new S3Client({
  region: config.storageRegion,
  credentials: {
    accessKeyId: config.storageKey,
    secretAccessKey: config.storageSecret,
  },
  endpoint: config.storageEndpoint,
  forcePathStyle: config.storageForcePathStyle,
});

const s3 = new AWS.S3({
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

async function generateSignedUploadFastaUrl(
  bucket,
  key,
  expiresInHours = 1,
  metadata,
) {
  const client = new S3Client({
    region: config.storageRegion,
    credentials: {
      accessKeyId: config.storageKey,
      secretAccessKey: config.storageSecret,
    },
    endpoint: "http://localhost:9100",
    forcePathStyle: config.storageForcePathStyle,
  });
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
    return response.Body.pipe(gunzipMaybe());
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

async function* listObjects(
  bucket,
  prefix,
) {
  let continuationToken;

  do {
    const params = {
      Bucket: bucket,
      ContinuationToken: continuationToken,
      Prefix: prefix,
    };

    const data = await client.send(new ListObjectsV2Command(params));
    const keys = [];

    if (data.Contents) {
      for (const item of data.Contents) {
        if (item.Size > 20) {
          keys.push(item.Key);
        }
        else {
          console.debug("Skipping empty object:", item.Key);
        }
      }
    }

    yield keys;

    continuationToken = data.NextContinuationToken;
  }
  while (continuationToken);
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

async function getObjectSizeInBytes(
  bucket,
  key,
) {
  const result = await head(
    bucket,
    key,
  );
  const contentLength = result["ContentLength"];
  return contentLength;
}

async function getGzippedJsonFromS3(bucket, key) {
  const params = { Bucket: bucket, Key: key };
  let s3Object;
  try {
    s3Object = await s3.getObject(params).promise();
  }
  catch (err) {
    if (err.code === "NoSuchKey" || err.code === "NotFound") {
      // Object does not exist
      return null;
    }
    throw err;
  }

  // Gunzip the object data
  const unzippedBuffer = await gunzipBuffer(s3Object.Body);


  // Parse and return the JSON
  const jsonStr = unzippedBuffer.toString("utf8");

  if (!jsonStr) {
    console.warn(`Empty JSON retrieved from S3 for bucket ${bucket} and key ${key}`);
    return undefined;
  }
  const json = JSON.parse(jsonStr);

  return json;
}

async function getGzippedObjectFromS3(bucket, key) {
  const params = { Bucket: bucket, Key: key };
  let s3Object;

  try {
    s3Object = await s3.getObject(params).promise();
  }
  catch (err) {
    if (err.code === "NoSuchKey" || err.code === "NotFound") {
      return undefined;
    }
    throw err;
  }

  const unzippedBuffer = await gunzipBuffer(s3Object.Body);

  if (!unzippedBuffer || unzippedBuffer.length === 0) {
    console.warn(`Empty object retrieved from S3 for bucket ${bucket} and key ${key}`);
    return undefined;
  }

  // Otherwise, return raw buffer
  return unzippedBuffer;
}

async function uploadGzippedJsonToS3(bucket, key, jsonObject) {

  const dataToUpload = jsonObject.results
    ? jsonObject.results
    : jsonObject;

  const jsonStr = JSON.stringify(dataToUpload);

  const gzipped = await gzip(jsonStr);

  const params = {
    Bucket: bucket,
    Key: key,
    Body: gzipped,
    ContentType: "application/json",
    ContentEncoding: "gzip",
  };

  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

async function uploadGzippedObjectToS3(bucket, key, data) {

  const body = await gzip(data);

  const params = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: "application/text",
    ContentEncoding: "gzip",
  };

  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

export default {
  copyObject,
  deleteObject,
  exists,
  generateSignedGetUrl,
  generateSignedUploadFastaUrl,
  generateSignedUploadUrl,
  generateUrl,
  getMetadata,
  getObjectSizeInBytes,
  head,
  listObjects,
  move,
  retrieve,
  setMetadata,
  store,
  getGzippedJsonFromS3,
  getGzippedObjectFromS3,
  uploadGzippedJsonToS3,
  uploadGzippedObjectToS3,
};
