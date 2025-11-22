import { EarthquakeService } from '/src/services/EarthquakeService.js';
import { WeatherService } from '/src/services/WeatherService.js';
import { MapService } from '/src/services/MapService.js';
import { RoutingService } from '/src/services/RoutingService.js';
import { createEarthquakeLayer, createTsunamiLayer, createWeatherAlertsLayer } from '/src/utils/layerFactory.js';
import { createTitleControl, createLegendControl, setupLegendToggle } from '/src/utils/mapControls.js';
import { createRouteLayer, createRouteMarkers, createInstructionsControl, createEvacuationPointMarker } from '/src/utils/routeHelpers.js';
import '/src/css/style.css';

// --------------------------------------
// Service Initialization
// --------------------------------------
const earthquakeService = new EarthquakeService();
const weatherService = new WeatherService();
const mapService = new MapService();
const routingService = new RoutingService();

// --------------------------------------
// Global State
// --------------------------------------
let currentMap = null;
let activeRoutes = [];
let activeMarkers = [];
let instructionsControl = null;

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
  
  // Store map reference globally
  currentMap = map;

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

  // Add evacuation points
  addEvacuationPoints(map);

  // Setup routing controls
  setupRoutingControls(map);
}

// --------------------------------------
// Evacuation Points
// --------------------------------------
function addEvacuationPoints(map) {
  // Define evacuation points (customize for your area)
  const evacuationPoints = [
    { 
      name: 'Emergency Shelter - North',
      lat: 32.85,
      lng: -117.15,
      type: 'Shelter'
    },
    { 
      name: 'Hospital - East',
      lat: 32.72,
      lng: -117.05,
      type: 'Medical'
    },
    { 
      name: 'Safe Zone - West',
      lat: 32.70,
      lng: -117.25,
      type: 'Safe Zone'
    }
  ];

  // Add evacuation point markers
  evacuationPoints.forEach(point => {
    const marker = createEvacuationPointMarker(point);
    marker.on('click', () => {
      calculateRouteToEvacuationPoint(point);
    });
    marker.addTo(map);
  });
}

// --------------------------------------
// Routing Controls
// --------------------------------------
function setupRoutingControls(map) {
  // Add routing button control
  const routingControl = L.control({ position: 'topright' });

  routingControl.onAdd = function () {
    const div = L.DomUtil.create('div', 'routing-control');
    div.innerHTML = `
      <button id="toggle-routing" class="routing-button" title="Click map to plan escape route">
        🚗 Plan Escape Route
      </button>
      <button id="clear-routes" class="routing-button clear-button" title="Clear all routes">
        🗑️ Clear Routes
      </button>
      <button id="find-nearest" class="routing-button" title="Find nearest evacuation point">
        🏥 Nearest Shelter
      </button>
    `;

    L.DomEvent.disableClickPropagation(div);
    return div;
  };

  routingControl.addTo(map);

  // Setup button handlers
  setupRoutingButtonHandlers(map);
}

// --------------------------------------
// Routing Button Handlers
// --------------------------------------
function setupRoutingButtonHandlers(map) {
  let routingMode = false;

  // Toggle routing mode
  document.addEventListener('click', (e) => {
    if (e.target.id === 'toggle-routing') {
      routingMode = !routingMode;
      const button = document.getElementById('toggle-routing');
      
      if (routingMode) {
        button.classList.add('active');
        button.textContent = '✓ Click Destination';
        map.getContainer().style.cursor = 'crosshair';
      } else {
        button.classList.remove('active');
        button.textContent = '🚗 Plan Escape Route';
        map.getContainer().style.cursor = '';
      }
    }

    // Clear all routes
    if (e.target.id === 'clear-routes') {
      clearAllRoutes();
    }

    // Find nearest evacuation point
    if (e.target.id === 'find-nearest') {
      findNearestEvacuationPoint();
    }
  });

  // Handle map clicks for routing
  map.on('click', async (e) => {
    if (routingMode) {
      await calculateRouteToPoint(e.latlng);
      routingMode = false;
      const button = document.getElementById('toggle-routing');
      button.classList.remove('active');
      button.textContent = '🚗 Plan Escape Route';
      map.getContainer().style.cursor = '';
    }
  });
}

// --------------------------------------
// Calculate Route to Point
// --------------------------------------
async function calculateRouteToPoint(destination) {
  try {
    // Get current map center as starting point (or use geolocation)
    const center = currentMap.getCenter();
    const start = [center.lng, center.lat];
    const end = [destination.lng, destination.lat];

    // Calculate routes
    const routes = await routingService.calculateRoute(start, end);

    // Clear previous routes
    clearAllRoutes();

    // Display primary route
    const primaryRoute = routes[0];
    const routeLayer = createRouteLayer(primaryRoute, true);
    routeLayer.addTo(currentMap);
    activeRoutes.push(routeLayer);

    // Display alternative routes
    routes.slice(1).forEach(route => {
      const altRouteLayer = createRouteLayer(route, false);
      altRouteLayer.addTo(currentMap);
      activeRoutes.push(altRouteLayer);
    });

    // Add start/end markers
    const { startMarker, endMarker } = createRouteMarkers(
      [center.lat, center.lng],
      [destination.lat, destination.lng],
      'Destination'
    );
    startMarker.addTo(currentMap);
    endMarker.addTo(currentMap);
    activeMarkers.push(startMarker, endMarker);

    // Show turn-by-turn instructions
    const instructions = routingService.getRouteInstructions(primaryRoute);
    if (instructionsControl) {
      currentMap.removeControl(instructionsControl);
    }
    instructionsControl = createInstructionsControl(instructions);
    instructionsControl.addTo(currentMap);

    // Fit map to route bounds
    currentMap.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });

  } catch (error) {
    console.error('Failed to calculate route:', error);
    alert('Unable to calculate route. Please try again.');
  }
}

// --------------------------------------
// Calculate Route to Evacuation Point
// --------------------------------------
async function calculateRouteToEvacuationPoint(point) {
  await calculateRouteToPoint({ lat: point.lat, lng: point.lng });
}

// --------------------------------------
// Find Nearest Evacuation Point
// --------------------------------------
async function findNearestEvacuationPoint() {
  const center = currentMap.getCenter();
  const currentLocation = { lat: center.lat, lng: center.lng };

  const evacuationPoints = [
    { name: 'Emergency Shelter - North', lat: 32.85, lng: -117.15 },
    { name: 'Hospital - East', lat: 32.72, lng: -117.05 },
    { name: 'Safe Zone - West', lat: 32.70, lng: -117.25 }
  ];

  try {
    const routes = await routingService.calculateEvacuationRoutes(
      currentLocation,
      evacuationPoints
    );

    if (routes.length > 0) {
      const nearest = routes[0];
      alert(`Nearest evacuation point: ${nearest.destination}\nDistance: ${nearest.routes[0].distanceMiles} miles\nETA: ${nearest.routes[0].durationMinutes} minutes`);
      
      // Calculate and display route
      const point = evacuationPoints.find(p => p.name === nearest.destination);
      await calculateRouteToEvacuationPoint(point);
    }
  } catch (error) {
    console.error('Failed to find nearest evacuation point:', error);
    alert('Unable to find nearest evacuation point. Please try again.');
  }
}

// --------------------------------------
// Clear All Routes
// --------------------------------------
function clearAllRoutes() {
  // Remove route layers
  activeRoutes.forEach(route => {
    currentMap.removeLayer(route);
  });
  activeRoutes = [];

  // Remove markers
  activeMarkers.forEach(marker => {
    currentMap.removeLayer(marker);
  });
  activeMarkers = [];

  // Remove instructions
  if (instructionsControl) {
    currentMap.removeControl(instructionsControl);
    instructionsControl = null;
  }
}

// --------------------------------------
// Application Entry Point
// --------------------------------------
loadEarthquakeData();
