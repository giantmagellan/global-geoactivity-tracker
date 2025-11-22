10// --------------------------------------
// Popup Content
// --------------------------------------

export function onEachFeature(feature, layer) {
  const tsunamiWarning = feature.properties.tsunami === 1
    ? '<p style="color: red; font-weight: bold;">⚠️ TSUNAMI WARNING</p>'
    : '';

  const alertLevel = feature.properties.alert
    ? '<p><strong>Alert Level:</strong> ' + feature.properties.alert.toUpperCase() + ' - ' + getAlertDescription(feature.properties.alert) + '</p>'
    : '';

  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
    "<p><strong>Magnitude:</strong> " + feature.properties.mag + "</p>" +
    tsunamiWarning +
    alertLevel);
}

// --------------------------------------
// Alert Level Descriptions
// --------------------------------------

export function getAlertDescription(alert) {
  const descriptions = {
    'green': 'No response needed',
    'yellow': 'Local/regional response',
    'orange': 'National response',
    'red': 'International response'
  };

  return descriptions[alert] || '';
}

// --------------------------------------
// Point to Layer Conversion
// --------------------------------------

export function pointToLayer(geoJsonPoint, latlng) {
  return L.circleMarker(latlng);
}

// --------------------------------------
// Styling Functions
// --------------------------------------

export function style(geoJsonFeature) {
  const alert = geoJsonFeature.properties.alert;
  const alertStyles = getAlertStyle(alert);

  return {
    fillColor: getColor(geoJsonFeature.properties.mag),
    color: alertStyles.color,
    weight: alertStyles.weight,
    fillOpacity: .25,
    radius: markerSize(geoJsonFeature.properties.mag / 1.5)
  }
}

export function tsunamiStyle(geoJsonFeature) {
  return {
    fillColor: "#ff0000",  // Red for tsunami warnings
    color: "#ff6600",
    weight: 2,
    fillOpacity: 0.7,
    radius: markerSize(geoJsonFeature.properties.mag / 1.5) * 1.5  // Larger
  }
}

export function getAlertStyle(alert) {
  const alertLevels = {
    'red': { color: '#ff0000', weight: 12 },
    'orange': { color: '#ff8c00', weight: 9 },
    'yellow': { color: '#ffff00', weight: 6 },
    'green': { color: '#00ff00', weight: 3 }
  };

  return alertLevels[alert] || { color: '#0b0b0bff', weight: 1 };
}

// --------------------------------------
// Color Scale
// --------------------------------------

export function getColor(magnitude) {
  const colorScale = [
    { threshold: 8.0, color: "#de2c1fff" }, // Great: Red
    { threshold: 7.0, color: "#e9db12ff" },  // Major: Yellow
    { threshold: 5.5, color: "#7ee815ff" },  // Strong: Bright Green
    { threshold: 4.0, color: "#40E0D0" },    // Moderate: Green Sherbert
    { threshold: 2.5, color: "#185bd8ff" },  // Light: Midnight Blue
    { threshold: 0, color: "#541edeff" }     // Minor: Dark Purple
  ];

  return colorScale.find(scale => magnitude >= scale.threshold)?.color || "#12c2e9";
}

// --------------------------------------
// Marker Size Calculation
// --------------------------------------

export function markerSize(magnitude) {
  return magnitude * 12;
}
