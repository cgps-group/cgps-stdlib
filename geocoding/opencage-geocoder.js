const opencage = require("opencage-api-client");

// const stopwatch = require("../stopwatch.js");

function opencageGeocoder(
  opencageApiKey,
  query,
  confidenceSorce,
  proximity,
) {
  // stopwatch.start("opencage geocoder");
  return opencage
    .geocode({
      key: opencageApiKey,
      limit: 1,
      min_confidence: confidenceSorce,
      no_annotations: 1,
      no_record: 1,
      proximity,
      q: query,
    })
    .then((data) => {
      // stopwatch.stop("opencage geocoder");
      if (data.results.length > 0) {
        const place = data.results[0];
        return place;
      }
      else {
        return undefined;
      }
    })
    .catch((error) => {
      if (error.status.code === 402) {
        throw new Error("OpenCage limit exceeded, see https://opencagedata.com/pricing");
      }
      console.error({
        query,
        error,
      });
      throw new Error(`OpenCage error ${error?.status?.code}`);
    });
}

module.exports = opencageGeocoder;

// const featureMap = {
//   "house number": "house_number",
//   "address": "road",
//   "postcode": "postcode",
//   "locality": "village",
//   "village": "village",
//   "town": "town",
//   "place": "town",
//   "neighborhood": "suburb",
//   "district": "city",
//   "city": "city",
//   "county": "county",
//   "region": "state",
//   "state": "state",
//   "country": "country",
//   "country code": "country_code",
//   "ISO 3166-1 alpha 2": "ISO_3166-1_alpha-2",
//   "ISO 3166-1 alpha 3": "ISO_3166-1_alpha-3",
//   "continent": "continent",
//   "poi": "",
//   "full": "",
//   "what3words": "",
//   "flag": "",
//   "timezone code": "",
//   "timezone name": "",
//   "currency code": "",
//   "currency name": "",
//   "geometry": "",
// };

// const mapbox = {
//   "country": "country",
//   "region": "region",
//   "postcode": "postcode",
//   "district": "county",
//   "place": "city",
//   "locality": "locality",
//   "neighborhood": "neighborhood",
//   "address": "road",
//   "poi": "full",
// };

// const componentsMap = {
//   "house number": [
//     "house_number",
//     "street_number",
//     "housenumber",
//   ],
//   "building": [
//     "house",
//     "building",
//     "public_building",
//     "isolated_dwelling",
//     "farmland",
//     "allotments",
//   ],
//   "road": [
//     "road",
//     "footway",
//     "street",
//     "street_name",
//     "residential",
//     "path",
//     "pedestrian",
//     "road_reference",
//     "road_reference_intl",
//     "square",
//     "place",
//   ],
//   "locality": [
//     "hamlet",
//     "locality",
//     "croft",
//     "village",
//   ],
//   "neighbourhood": [
//     "neighbourhood",
//     "suburb",
//     "city_district",
//     "district",
//     "quarter",
//     "borough",
//     "city_block",
//     "residential",
//     "commercial",
//     "industrial",
//     "houses",
//     "subdistrict",
//     "subdivision",
//     "ward",
//   ],
//   "city": [
//     "city",
//     "town",
//     "township",
//     "postal_city",
//   ],
//   "municipality": [
//     "municipality",
//     "local_administrative_area",
//     "subcounty",
//   ],
//   "county": [
//     "county",
//     "county_code",
//     "department",
//   ],
//   "state_district": [
//     "state_district",
//   ],
//   "postcode": [
//     "postcode",
//     "postal_code",
//     "partial_postcode",
//   ],
//   "state": [
//     "state",
//     "province",
//     "state_code",
//   ],
//   "region": [
//     "region",
//   ],
//   "island": [
//     "island",
//   ],
//   "archipelago": [
//     "archipelago",
//   ],
//   "country": [
//     "country",
//     "country_name",
//   ],
//   "country code": [
//     "country_code",
//   ],
//   "continent": [
//     "continent",
//   ],
// };

// module.exports.geocodedPlaceToFeature = function geocodedPlaceToFeature(place, feature) {
//   if (feature === "full" || feature === "") {
//     return place.formatted;
//   }

//   if (feature === "geometry") {
//     return [ place.geometry.lat, place.geometry.lng, place.components._type ];
//   }

//   if (!(feature in componentsMap)) {
//     throw new Error("Invalid feature");
//   }

//   for (const componentName of componentsMap[feature]) {
//     if (place.components[componentName]) {
//       return place.components[componentName];
//     }
//   }

//   // if (feature === "flag") {
//   //   return place?.annotations?.flag;
//   // }

//   // if (feature === "currency code") {
//   //   return place?.annotations?.currency?.code;
//   // }
//   // if (feature === "currency name") {
//   //   return place?.annotations?.currency?.name;
//   // }

//   // if (feature === "what3words") {
//   //   return place?.annotations?.what3words?.words;
//   // }

//   // if (feature === "timezone code") {
//   //   return place?.annotations?.timezone?.short_name;
//   // }
//   // if (feature === "timezone name") {
//   //   return place?.annotations?.timezone?.name;
//   // }

//   throw new Error("Invalid feature");
// };
