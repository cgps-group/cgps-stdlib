const { default: log } = require("roarr");
const { default: createSerializeErrorMiddleware } = require("@roarr/middleware-serialize-error");

const childLog = log.child(createSerializeErrorMiddleware());

module.exports = childLog;
