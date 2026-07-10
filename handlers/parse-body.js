import { fromZodError } from "zod-validation-error";
import { ApiError } from "cgps-stdlib/errors/catch-api-errors";

async function parseBody(req, res, schema) {
  try {
    const parsedBody = schema.parse(req.body);
    return parsedBody;
  }
  catch (err) {
    const message = fromZodError(
      err,
      { prefix: "Body validation error" },
    );
    throw new ApiError(400, message);
  }
}

export default parseBody;
