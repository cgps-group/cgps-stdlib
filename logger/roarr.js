const { Roarr: log } = require("roarr");
const { default: createSerializeErrorMiddleware } = require("@roarr/middleware-serialize-error");

console.log(log)

const childLog = log.child(createSerializeErrorMiddleware());

module.exports = childLog;
