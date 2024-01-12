import logger from "cgps-stdlib/logger/index.js";
import ApiError from "./api-error.js";

export { default as ApiError } from "./api-error.js";

// export const ApiError = apiUtils.ApiError;

export default function catchApiErrors(handler) {
  // eslint-disable-next-line consistent-return
  return async (request, response) => {
    try {
      return await handler(request, response);
    }
    catch (err) {
      if (err instanceof ApiError || err.isApiError?.()) {
        response.statusCode = err.statusCode;
        response.statusMessage = err.message;
        response.end(err.message);
      }
      else {
        logger.error(err);
        throw err;
      }
    }
  };
}
