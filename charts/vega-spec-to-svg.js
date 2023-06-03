async function vegaSpecToSvg(vegaSpec) {
  const vega = require("vega");
  const view = new vega.View(
    vega.parse(vegaSpec),
    { renderer: "none" },
  );
  const svg = await view.toSVG();
  return svg;
}

export default vegaSpecToSvg;
