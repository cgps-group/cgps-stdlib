const axios = require("axios");

const sleep = require("../async/sleep.js");

async function httpRequest(options) {
  const { retries = 1, ...rest } = options;
  if (retries === 1) {
    return axios(rest);
  }
  else {
    for (let index = 1; index <= retries; index++) {
      try {
        console.log(rest, "http request");
        const res = await axios(rest);
        if (res.status === 200) {
          return res;
        }
      }
      catch (error) {
        console.error(error);
        if (index === retries) {
          throw error;
        }
      }
      await sleep(index);
    }

    throw new Error("Request failed");
  }
}

module.exports = httpRequest;
