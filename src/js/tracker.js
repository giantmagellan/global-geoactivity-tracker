import { EarthquakeService } from '/src/services/EarthquakeService.js';
import { WeatherService } from '/src/services/WeatherService.js';
import { MapService } from '/src/services/MapService.js';
import { createEarthquakeLayer, createTsunamiLayer, createWeatherAlertsLayer } from '/src/utils/layerFactory.js';
import { createTitleControl, createLegendControl, setupLegendToggle } from '/src/utils/mapControls.js';
import '/src/css/style.css';

// --------------------------------------
// Service Initialization
// --------------------------------------
const earthquakeService = new EarthquakeService();
const weatherService = new WeatherService();
const mapService = new MapService();

// --------------------------------------
// Data Loading Functions
// --------------------------------------
async function loadEarthquakeData() {
  try {
    const features = await earthquakeService.fetchEarthquakeData();
    await createFeatures(features);
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

// --------------------------------------
// Layer Creation and Map Setup
// --------------------------------------
async function createFeatures(earthquakeData) {
  // Create earthquake layers
  const earthquakes = createEarthquakeLayer(earthquakeData);
  const tsunamiEarthquakes = createTsunamiLayer(earthquakeData);

  // Create weather alerts layer
  const weatherData = await loadWeatherAlerts();
  const weatherAlerts = createWeatherAlertsLayer(weatherData);

  // Initialize and setup map
  setupMap(earthquakes, tsunamiEarthquakes, weatherAlerts);
}

// --------------------------------------
// Map Initialization and Configuration
// --------------------------------------
function setupMap(earthquakes, tsunamiEarthquakes, weatherAlerts) {
  // Initialize base maps
  const baseMaps = mapService.initializeBaseMaps();

  // Create overlay maps
  mapService.createOverlayMaps(earthquakes, tsunamiEarthquakes, weatherAlerts);

  // Initialize map with default layers
  const quakeMarkers = L.layerGroup([]);
  const map = mapService.initializeMap("map", [baseMaps["Dark Map"], quakeMarkers, earthquakes]);

  // Add layer control
  mapService.addLayerControl();

  // Add title banner
  const title = createTitleControl();
  title.addTo(map);

  // Add legend
  const legend = createLegendControl();
  legend.addTo(map);

  // Setup legend toggle with earthquake layer
  setupLegendToggle(map, legend);
}

// --------------------------------------
// Application Entry Point
// --------------------------------------
loadEarthquakeData();
