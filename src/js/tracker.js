import { API_KEY, TILE_LAYER_URL, TILE_ATTRIBUTION } from '/src/config/config.js';
import { EarthquakeService } from '/src/services/EarthquakeService.js';
import { WeatherService } from '/src/services/WeatherService.js';
import { onEachFeature, pointToLayer, style, tsunamiStyle } from '/src/utils/earthquakeHelpers.js';
import { onEachWeatherFeature, weatherAlertStyle } from '/src/utils/weatherHelpers.js';
import '/src/css/style.css';

// --------------------------------------
// Ingestion
// --------------------------------------

const earthquakeService = new EarthquakeService();
const weatherService = new WeatherService();

async function loadEarthquakeData() {
  try {
    const features = await earthquakeService.fetchEarthquakeData();
    createFeatures(features);
  } catch (error) {
    console.error('Error loading earthquake data:', error);
  }
}

async function loadWeatherAlerts() {
  try {
    const features = await weatherService.fetchActiveAlerts();
    return features;
  } catch (error) {
    console.error('Error loading weather alert data:', error);
    return [];
  }
}

loadEarthquakeData();

// --------------------------------------
// Features and Popups for Earthquakes
// --------------------------------------
async function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer,
    style: style
  });

  // Tsunami warnings layer
  var tsunamiEarthquakes = L.geoJSON(earthquakeData, {
    filter: function (feature) {
      return feature.properties.tsunami === 1;
    },
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer,
    style: tsunamiStyle
  });

  // Weather alerts layer
  const weatherData = await loadWeatherAlerts();
  // Filter for alerts with valid geometry
  const weatherDataWithGeometry = weatherData.filter(feature => feature.geometry !== null);
  var weatherAlerts = L.geoJSON(weatherDataWithGeometry, {
    onEachFeature: onEachWeatherFeature,
    style: weatherAlertStyle
  });

  // Pass all layers to createMap
  createMap(earthquakes, tsunamiEarthquakes, weatherAlerts);
}

// Arrays to hold created markers
var quakeMarkers = [];

// --------------------------------------
// Function to create earthquake map
// --------------------------------------
function createMap(earthquakes, tsunamiEarthquakes, weatherAlerts) {

  const tileSize = 512
  const zoomOffset = -1
  const maxZoom = 18

  // Helper function to create tile layers
  const createTileLayer = (styleId) => {
    return L.tileLayer(TILE_LAYER_URL, {
      attribution: TILE_ATTRIBUTION,
      tileSize: tileSize,
      zoomOffset: zoomOffset,
      maxZoom: maxZoom,
      id: styleId,
      accessToken: API_KEY
    });
  };

  const darkmap = createTileLayer("mapbox/dark-v11");
  const outdoors = createTileLayer("mapbox/outdoors-v12");
  const satellite = createTileLayer("mapbox/satellite-streets-v12");

  // --------------------------------------
  // Layers, Basemaps, and Overlay Objects
  // --------------------------------------
  var quakes = L.layerGroup(quakeMarkers);

  // BaseMaps object to hold base layer
  var baseMaps = {
    "Dark Map": darkmap,
    "Outdoors": outdoors,
    "Satellite": satellite
  };

  // Overlay object to hold overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tsunami Warnings": tsunamiEarthquakes,
    "Weather Alerts": weatherAlerts
  };

  // Inital map object with central coordinates at Las Vegas, NV
  var lvMap = L.map("map", {
    center: [36.17, -115.14],
    zoom: 5,
    layers: [darkmap, quakes, earthquakes],
    zoomControl: false
  });

  L.control.zoom({
    position: 'bottomleft'
  }).addTo(lvMap)


  const layerControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(lvMap);

  // --------------------------------------
  // Title Banner
  // --------------------------------------
  const title = L.control({ position: "topleft" });

  title.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info title');
    div.innerHTML = '<h2>Global Geographic Activity</h2><p>Real-time data from USGS</p>';
    return div;
  };

  title.addTo(lvMap);

  // --------------------------------------
  // Legend
  // --------------------------------------
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (lvmap) {
    const div = L.DomUtil.create('div', 'info legend');

    div.innerHTML = '<h3>Earthquake Severity</h3>';
    div.innerHTML += '<i style="background: #12c2e9"></i><span>Minor (&lt;2.5)</span><br>';
    div.innerHTML += '<i style="background: #40E0D0"></i><span>Light (2.5-3.9)</span><br>';
    div.innerHTML += '<i style="background: #6b99eb"></i><span>Moderate (4.0-5.4)</span><br>';
    div.innerHTML += '<i style="background: #c471ed"></i><span>Strong (5.5-6.9)</span><br>';
    div.innerHTML += '<i style="background: #e560a3"></i><span>Major (7.0-7.9)</span><br>';
    div.innerHTML += '<i style="background: #f64f59"></i><span>Great (8.0+)</span><br>';

    return div;
  };

  legend.addTo(lvMap);

  // --------------------------------------
  // Toggle Legend with Earthquake Layer
  // --------------------------------------
  lvMap.on('overlayadd', function(eventLayer) {
    if (eventLayer.name === 'Earthquakes') {
      lvMap.addControl(legend);
    }
  });

  lvMap.on('overlayremove', function(eventLayer) {
    if (eventLayer.name === 'Earthquakes') {
      lvMap.removeControl(legend);
    }
  });
}
