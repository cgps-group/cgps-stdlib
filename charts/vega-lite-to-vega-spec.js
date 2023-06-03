import lite from "vega-lite";

function vegaLiteToVegaSpec(vegaLiteSpec) {
  const vegaSpec = lite.compile(vegaLiteSpec);
  return vegaSpec.spec;
}

export default vegaLiteToVegaSpec;
