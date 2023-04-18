const roarr = require("roarr").default;
const createSerializeErrorMiddleware = require("@roarr/middleware-serialize-error").default;

const childLog = roarr.child(createSerializeErrorMiddleware());
module.exports = childLog;
