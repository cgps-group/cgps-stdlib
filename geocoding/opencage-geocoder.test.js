const test = require("node:test");
const assert = require("node:assert");

const geocode = require("./opencage-geocoder.js");

test("given an invalid string, it should return undefined", async (t) => {
  const actual = await geocode(
    process.env.OPENCAGE_API_KEY,
    "Babraham Road, Sawston, CB22 3DQ, United Kingdom",
  );
  assert.deepEqual(
    actual,
    {
      "components": {
        "ISO_3166-1_alpha-2": "GB",
        "ISO_3166-1_alpha-3": "GBR",
        "ISO_3166-2": [
          "GB-ENG",
          "GB-CAM",
        ],
        "_category": "postcode",
        "_type": "postcode",
        "continent": "Europe",
        "country": "United Kingdom",
        "country_code": "gb",
        "county": "Cambridgeshire",
        "county_code": "CAM",
        "postcode": "CB22 3DQ",
        "region": "East of England",
        "state": "England",
        "state_code": "ENG",
        "suburb": "Sawston",
        "town": "South Cambridgeshire",
      },
      "confidence": 10,
      "formatted": "South Cambridgeshire, CB22 3DQ, United Kingdom",
      "geometry": {
        "lat": 52.126955,
        "lng": 0.171615,
      },
    },
  );
});
