import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

import sleep from "cgps-stdlib/async/sleep.js";

function run(
  accessToken,
  query,
  types,
) {
  const geocodingClient = mbxGeocoding({ accessToken });
  const request = (
    geocodingClient.forwardGeocode({
      query,
      limit: 1,
      types,
    })
  );
  return request.send();
}

function mapboxGeocoder(
  accessToken,
  input,
  types,
) {
  const query = (
    input
      .replace(/&apos /g, "'")
      .replace(/&apos;?/g, "'")
      .replace(/&amp;?/g, " and ")
      .replace(/&quot;?/g, " ")
      .replace(/;/g, " ")
  );
  return (
    run(
      accessToken,
      query,
      types,
    )
      .catch((error) => {
        if (error.type === "RequestAbortedError") {
          return sleep().then(() => run(query, types));
        }
        else {
          throw error;
        }
      })
      .then((results) => (results.body.features.length ? results.body.features[0] : null))
  );
}

export default mapboxGeocoder;
