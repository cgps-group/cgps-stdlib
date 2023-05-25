import roarr, { Roarr } from "roarr";
import createSerializeErrorMiddleware from "@roarr/middleware-serialize-error";

const childLog = (Roarr || roarr).child(createSerializeErrorMiddleware());

export default childLog;
