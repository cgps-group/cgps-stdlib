function convertToDecimalDegrees(location) {
  // Split the location string into parts
  const parts = location.split(" ");

  // Extract the numeric values and direction indicators
  const latValue = parseFloat(parts[0]);
  const latDirection = parts[1];
  const lonValue = parseFloat(parts[2]);
  const lonDirection = parts[3];

  // Convert to decimal degrees based on direction
  const decimalLat = latDirection === "N" ? latValue : -latValue;
  const decimalLon = lonDirection === "E" ? lonValue : -lonValue;

  // Return an object with decimal latitude and longitude
  return [
    decimalLon,
    decimalLat,
  ];
}

module.exports = convertToDecimalDegrees;
