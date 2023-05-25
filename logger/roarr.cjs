const roarr = require("roarr");
const createSerializeErrorMiddleware = require("@roarr/middleware-serialize-error");

const childLog = roarr.Roarr.child(createSerializeErrorMiddleware.default());
module.exports = childLog;
