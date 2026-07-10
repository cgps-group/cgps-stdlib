import { fromZodError } from "zod-validation-error";

import { ApiError } from "cgps-stdlib/errors/catch-api-errors";

async function parseQuery(req, res, schema) {
  try {
    const parsedQuery = schema.parse(req.query);
    return parsedQuery;
  }
  catch (err) {
    const message = fromZodError(
      err,
      { prefix: "Query validation error" },
    );
    throw new ApiError(400, message);
  }
}

export default parseQuery;
