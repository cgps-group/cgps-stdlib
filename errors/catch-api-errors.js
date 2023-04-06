import { ApiError as NextApiError } from "next/dist/server/api-utils";

export const ApiError = NextApiError;

export default function catchApiErrors(handler) {
  // eslint-disable-next-line consistent-return
  return async (request, response) => {
    try {
      return await handler(request, response);
    }
    catch (err) {
      if (err instanceof NextApiError) {
        response.statusCode = err.statusCode;
        response.statusMessage = err.message;
        response.end(err.message);
      }
      else {
        throw err;
      }
    }
  };
}
