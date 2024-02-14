import createOptions from "./create-options.js";
import createAuthRoutes from "./create-auth-routes.js";

function createAuthMiddleware(adapter) {
  const options = createOptions(adapter);

  return createAuthRoutes(options);
}

export default createAuthMiddleware;
