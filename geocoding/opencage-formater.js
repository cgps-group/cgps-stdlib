function opencageFormater(result, feature) {
  if (feature === "type") {
    const type = result?.components?._type;
    // if (result?.components?._type === "postcode") {
    //   type = "postal code";
    // }
    return type;
  }

  if (feature === "address" || !feature) {
    return result?.formatted;
  }

  if (feature === "position") {
    return [
      result.geometry.lat,
      result.geometry.lng,
    ];
  }

  if (feature === "country code") {
    return result?.components?.country_code?.toUpperCase?.() ?? result?.components?.["ISO_3166-1_alpha-3"];
  }

  if (feature === "country name") {
    return result?.components?.country;
  }

  if (feature === "ISO-3166-1-alpha-2") {
    return result?.components?.["ISO_3166-1_alpha-2"];
  }
  if (feature === "ISO-3166-1-alpha-3") {
    return result?.components?.["ISO_3166-1_alpha-3"];
  }
  if (feature === "ISO-3166-2") {
    return result?.components?.["ISO_3166-2"];
  }

  if (feature === "postcode" || feature === "postal code") {
    return result?.components?.postcode;
  }

  if (feature === "state name") {
    return result?.components?.state;
  }

  if (feature === "state code") {
    return result?.components?.state_code;
  }

  if (feature === "county") {
    return result?.components?.county;
  }

  if (feature === "city") {
    return result?.components?.city;
  }

  if (feature === "continent") {
    return result?.components?.continent;
  }

  throw new Error("Invalid feature");
}

module.exports = opencageFormater;
