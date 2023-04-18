import roarr from "roarr";
import createSerializeErrorMiddleware from "@roarr/middleware-serialize-error";

const childLog = roarr.child(createSerializeErrorMiddleware());

export default childLog;
