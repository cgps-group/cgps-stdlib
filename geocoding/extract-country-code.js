const GeoJsonGeometriesLookup = require("geojson-geometries-lookup");
const getCountryISO2 = require("country-iso-3-to-2");
const geojson = require("@geo-maps/countries-maritime-5m")();
const { lookUp } = require("geojson-places");

const lookup = new GeoJsonGeometriesLookup(geojson);

const colonists = new Set(["CHN", "FRA", "GBR", "USA"]);
function decolonise(features) {
  if (features.length > 1) {
    for (const { properties } of features) {
      const { A3 } = properties;
      if (colonists.has(A3)) {
        continue;
      }
      return A3;
    }
  }
  return features[0].properties.A3;
}

/**
 * Extracts the ISO 3166-1 alpha-2 country code for a given point.
 * @param {number} latitude A latitude in decimal degrees (-90 to +90).
 * @param {number} longitude A longitude in decimal degrees (-180 to +180).
 * @returns {string} An ISO 3166-1 alpha-2 country code if the coordinates are found within a country, otherwise `undefined`.
 */
function extractCountryCode(
  longitude,
  latitude,
) {
  const result = lookUp(latitude, longitude);
  if (result) {
    return result["country_a2"];
  }

  const point = {
    "type": "Point",
    "coordinates": [longitude, latitude],
  };
  const { features } = lookup.getContainers(point);

  if (features.length) {
    const iso3 = decolonise(features);
    const iso2 = getCountryISO2(iso3);
    return iso2;
  }

  return undefined;
}

module.exports = extractCountryCode;
