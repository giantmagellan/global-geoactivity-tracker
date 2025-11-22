import { onEachFeature, pointToLayer, style, tsunamiStyle } from '/src/utils/earthquakeHelpers.js';
import { onEachWeatherFeature, weatherAlertStyle } from '/src/utils/weatherHelpers.js';

// --------------------------------------
// Earthquake Layer Creation
// --------------------------------------
export function createEarthquakeLayer(earthquakeData) {
  return L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer,
    style: style
  });
}

// --------------------------------------
// Tsunami Warning Layer Creation
// --------------------------------------
export function createTsunamiLayer(earthquakeData) {
  return L.geoJSON(earthquakeData, {
    filter: function (feature) {
      return feature.properties.tsunami === 1;
    },
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer,
    style: tsunamiStyle
  });
}

// --------------------------------------
// Weather Alerts Layer Creation
// --------------------------------------
export function createWeatherAlertsLayer(weatherData) {
  // Filter for alerts with valid geometry
  const weatherDataWithGeometry = weatherData.filter(feature => feature.geometry !== null);
  
  return L.geoJSON(weatherDataWithGeometry, {
    onEachFeature: onEachWeatherFeature,
    style: weatherAlertStyle
  });
}
