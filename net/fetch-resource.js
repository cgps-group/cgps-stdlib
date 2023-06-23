const axios = require("axios");

const sleep = require("../async/sleep.js");

function fetchResourceOnce(options) {
  return (
    axios(options)
      .then((res) => res.data)
      .catch((error) => {
        console.error(error);
        // eslint-disable-next-line no-throw-literal
        throw {
          error,
          code: error?.response?.status,
          status: error?.response?.statusText,
          message: error?.response?.data,
        };
      })
  );
}

async function fetchResourceWithRetries(retries, options) {
  for (let index = 1; index <= retries; index++) {
    try {
      const res = await fetchResourceOnce(options);
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

async function fetchResource(options) {
  const { retries = 1, ...rest } = options;
  if (retries === 1) {
    return fetchResourceOnce(rest);
  }
  else {
    return fetchResourceWithRetries(retries, options);
  }
}

module.exports = fetchResource;
