import { Roarr } from "roarr";
import createSerializeErrorMiddleware from "@roarr/middleware-serialize-error";

const childLog = Roarr.child(createSerializeErrorMiddleware());

export default childLog;
