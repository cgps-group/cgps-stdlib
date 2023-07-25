import { promisify } from "util";
import fs from "fs";
import path from "path";
import Stream from "stream";
import zlib from "zlib";

import bytes from "bytes";
import tmp from "tmp-promise";
import pathExists from "path-exists";

import ApiError from "../errors/api-error.js";
import serverRuntimeConfig from "../config/server-runtime-config.js";

import writeFile from "./writers-digest.cjs";

const repoPath = path.resolve(serverRuntimeConfig.filesStorage.path);
const maxFileSizeInBytes = bytes.parse(serverRuntimeConfig.filesStorage.limit);
const tmpPath = path.join(repoPath);

const validHash = /^[a-f0-9]{40}$/;

function createTmpFile() {
  return tmp.file({ tmpdir: tmpPath }).then((data) => data.path);
}

async function checkFileSize(tmpFilePath) {
  const stats = await fs.promises.stat(tmpFilePath);
  console.log(stats.size, {maxFileSizeInBytes}, serverRuntimeConfig.filesStorage.limit)
  if (stats.size > maxFileSizeInBytes) {
    throw new ApiError(413, "Payload Too Large");
  }
  return tmpFilePath;
}

function hashToPath(hash) {
  if (!validHash.test(hash)) {
    throw new Error("Invalid hash.");
  }
  return path.join(
    repoPath,
    hash.substr(0, 2),
    `${hash.substr(2)}`,
  );
}

function saveContentToTmpFile(content) {
  const gzip = promisify(zlib.gzip);
  return (
    Promise.all([
      createTmpFile(),
      gzip(content),
    ])
      .then(([ tmpFilePath, gzippedContent ]) => {
        return (
          fs.promises.writeFile(tmpFilePath, gzippedContent)
            .then(() => tmpFilePath)
        );
      })
  );
}

function saveStreamToTmpFile(input) {
  const pipeline = promisify(Stream.pipeline);
  return (
    Promise.resolve()
      .then(createTmpFile)
      .then((tmpFilePath) => {
        return pipeline(
          input,
          // zlib.createGzip(),
          fs.createWriteStream(tmpFilePath)
        )
          .then(() => tmpFilePath);
        // input
        //   .pipe(zlib.createGzip())
        //   .pipe(fs.createWriteStream(tmpFilePath));
        // return (
        //   finished(input).then(() => tmpFilePath)
        // );
      })
  );
}

function storeFile(tmpFilePath) {
  return new Promise((resolve, reject) => {
    writeFile(
      tmpFilePath,
      repoPath,
      (error, info) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(info.digest);
        }
      },
    );
  });
}

export function storeText(content) {
  return (
    Promise.resolve(content)
      .then(saveContentToTmpFile)
      .then(storeFile)
  );
}

export function storeStream(input) {
  return (
    Promise.resolve(input)
      .then(saveStreamToTmpFile)
      .then(checkFileSize)
      .then(storeFile)
  );
}

export function readStream(fileHash) {
  return (
    Promise.resolve(hashToPath(fileHash))
      .then(fs.createReadStream)
      // .then((stream) => stream.pipe(zlib.createGunzip()))
      // .then((stream) => isGzip(stream))
      // .then(([ isGzipped, stream ]) => {
      //   if (isGzipped) {
      //     return stream.pipe(zlib.createGunzip());
      //   }
      //   else {
      //     return stream;
      //   }
      // })
  );
}

export function readText(fileHash) {
  return (
    readStream(fileHash)
      .then((stream) => {
        stream.setEncoding("utf8");
        return stream;
      })
  );
}

export function getFileSize(fileHash) {
  return (
    Promise.resolve(hashToPath(fileHash))
      .then((filePath) => fs.promises.stat(filePath))
      .then((stats) => stats.size)
  );
}

export function getFilePath(fileHash) {
  return path.resolve(
    hashToPath(fileHash)
  );
}

export function hasFile(hash) {
  return (
    Promise.resolve(hashToPath(hash))
      .then(pathExists)
  );
}
