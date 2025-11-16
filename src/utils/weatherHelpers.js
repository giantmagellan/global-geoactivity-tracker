// --------------------------------------
// Popup Content for Weather Alerts
// --------------------------------------

export function onEachWeatherFeature(feature, layer) {
  const props = feature.properties;
  const emoji = getWeatherEmoji(props.event);

  layer.bindPopup(
    "<h3>" + emoji + " " + props.event + "</h3>" +
    "<hr>" +
    "<p><strong>Severity:</strong> " + props.severity + "</p>" +
    "<p><strong>Urgency:</strong> " + props.urgency + "</p>" +
    "<p><strong>Headline:</strong> " + props.headline + "</p>" +
    "<p><strong>Description:</strong> " + props.description + "</p>"
  );
}

// --------------------------------------
// Point to Layer for Weather Alerts
// --------------------------------------

export function weatherPointToLayer(geoJsonPoint, latlng) {
  const emoji = getWeatherEmoji(geoJsonPoint.properties.event);

  return L.marker(latlng, {
    icon: L.divIcon({
      html: `<div style="font-size: 24px;">${emoji}</div>`,
      className: 'weather-emoji-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })
  });
}

// --------------------------------------
// Weather Event Emoji Mapping
// --------------------------------------

export function getWeatherEmoji(event) {
  const eventLower = event.toLowerCase();

  if (eventLower.includes('tornado')) return '🌪️';
  if (eventLower.includes('hurricane') || eventLower.includes('tropical storm')) return '🌀';
  if (eventLower.includes('flood')) return '🌊';
  if (eventLower.includes('fire') || eventLower.includes('red flag')) return '🔥';
  if (eventLower.includes('snow') || eventLower.includes('blizzard')) return '❄️';
  if (eventLower.includes('ice') || eventLower.includes('freezing')) return '🧊';
  if (eventLower.includes('thunder') || eventLower.includes('lightning')) return '⚡';
  if (eventLower.includes('wind')) return '💨';
  if (eventLower.includes('heat')) return '🌡️';
  if (eventLower.includes('fog')) return '🌫️';
  if (eventLower.includes('tsunami')) return '🌊';
  if (eventLower.includes('earthquake')) return '🏚️';
  if (eventLower.includes('avalanche')) return '⛰️';
  if (eventLower.includes('dust')) return '🌪️';
  if (eventLower.includes('rain')) return '🌧️';

  return '⚠️'; // Default warning emoji
}

// --------------------------------------
// Styling for Weather Alerts
// --------------------------------------

export function weatherAlertStyle(geoJsonFeature) {
  const severity = geoJsonFeature.properties.severity;
  const styleMap = getSeverityStyle(severity);

  return {
    fillColor: styleMap.fillColor,
    color: styleMap.color,
    weight: 2,
    fillOpacity: 0.3
  };
}

export function getSeverityStyle(severity) {
  const severityStyles = {
    'Extreme': { fillColor: '#ff0000', color: '#580707ff' },
    'Severe': { fillColor: '#ff8c00', color: '#7e2809ff' },
    'Moderate': { fillColor: '#ffd700', color: '#7d5408ff' },
    'Minor': { fillColor: '#ffff00', color: '#746407ff' },
    'Unknown': { fillColor: '#808080', color: '#191717ff' }
  };

  return severityStyles[severity] || severityStyles['Unknown'];
}
