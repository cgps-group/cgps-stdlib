const test = require("node:test");
const assert = require("node:assert");

const formater = require("./opencage-formater.js");

const place = {
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
    "city": "England",
    "suburb": "Sawston",
    "town": "South Cambridgeshire",
    "village": "Sawston",
  },
  "confidence": 10,
  "formatted": "Sawston, CB22 3DQ, United Kingdom",
  "geometry": {
    "lat": 52.126955,
    "lng": 0.171615,
  },
};

test("given type, it should return postcode", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "type",
    ),
    "postcode"
  );
});

test("given address, it should return Sawston, CB22 3DQ, United Kingdom", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "address",
    ),
    "Sawston, CB22 3DQ, United Kingdom"
  );
});

test("given position, it should return [52.126955, 0.171615]", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "position",
    ),
    [52.126955, 0.171615],
  );
});

test("given country code, it should return GB", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "country code",
    ),
    "GB"
  );
});

test("given country name, it should return United Kingdom", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "country name",
    ),
    "United Kingdom"
  );
});

test("given ISO-3166-1-alpha-2, it should return GB", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "ISO-3166-1-alpha-2",
    ),
    "GB"
  );
});

test("given ISO-3166-1-alpha-3, it should return GBR", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "ISO-3166-1-alpha-3",
    ),
    "GBR"
  );
});

test("given ISO-3166-2, it should return [\"GB-ENG\", \"GB-CAM\"]", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "ISO-3166-2",
    ),
    ["GB-ENG", "GB-CAM"]
  );
});

test("given postcode, it should return CB22 3DQ", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "postcode",
    ),
    "CB22 3DQ"
  );
});

test("given postal code, it should return CB22 3DQ", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "postal code",
    ),
    "CB22 3DQ"
  );
});

test("given county, it should return Cambridgeshire", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "county",
    ),
    "Cambridgeshire"
  );
});

test("given state name, it should return England", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "state name",
    ),
    "England"
  );
});

test("given state code, it should return ENG", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "state code",
    ),
    "ENG"
  );
});

test("given continent, it should return Europe", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "continent",
    ),
    "Europe"
  );
});

test("given city, it should return England", async (t) => {
  assert.deepEqual(
    formater(
      place,
      "city",
    ),
    "England"
  );
});
