# Escape Route Planning - Usage Guide

## Overview
The routing system provides real-time, traffic-aware escape route planning for natural disaster scenarios.

## Features
✅ **Traffic-Aware Routing** - Uses Mapbox Directions API with real-time traffic data  
✅ **Multiple Route Options** - Shows primary and alternative escape routes  
✅ **Turn-by-Turn Directions** - Detailed navigation instructions  
✅ **Evacuation Points** - Pre-defined safe locations  
✅ **Danger Zone Avoidance** - Highlights areas to avoid  

## Basic Usage

### 1. Import Services
```javascript
import { RoutingService } from '/src/services/RoutingService.js';
import { 
  createRouteLayer, 
  createRouteMarkers,
  createInstructionsControl 
} from '/src/utils/routeHelpers.js';
```

### 2. Initialize Routing Service
```javascript
const routingService = new RoutingService();
```

### 3. Calculate Escape Route
```javascript
// User's current location
const currentLocation = { lng: -117.1611, lat: 32.7157 }; // San Diego

// Safe evacuation point
const evacuationPoint = { lng: -117.2, lat: 32.8 };

// Calculate route
const routes = await routingService.calculateRoute(
  [currentLocation.lng, currentLocation.lat],
  [evacuationPoint.lng, evacuationPoint.lat]
);

// Display primary route on map
const primaryRoute = routes[0];
const routeLayer = createRouteLayer(primaryRoute, true);
routeLayer.addTo(map);

// Add start/end markers
const { startMarker, endMarker } = createRouteMarkers(
  [currentLocation.lat, currentLocation.lng],
  [evacuationPoint.lat, evacuationPoint.lng],
  'Safe Zone'
);
startMarker.addTo(map);
endMarker.addTo(map);

// Show turn-by-turn directions
const instructions = routingService.getRouteInstructions(primaryRoute);
const instructionsControl = createInstructionsControl(instructions);
instructionsControl.addTo(map);
```

### 4. Define Evacuation Points
```javascript
const evacuationPoints = [
  { 
    name: 'Emergency Shelter - North',
    lat: 32.8,
    lng: -117.2,
    type: 'Shelter'
  },
  { 
    name: 'Hospital - East',
    lat: 32.7,
    lng: -117.0,
    type: 'Medical'
  },
  { 
    name: 'Safe Zone - West',
    lat: 32.75,
    lng: -117.3,
    type: 'Safe Zone'
  }
];

// Find fastest evacuation route
const evacuationRoutes = await routingService.calculateEvacuationRoutes(
  currentLocation,
  evacuationPoints
);

console.log('Fastest evacuation:', evacuationRoutes[0]);
```

### 5. Mark Danger Zones
```javascript
import { createDangerZoneLayer } from '/src/utils/routeHelpers.js';

const dangerZones = [
  {
    center: { lat: 32.72, lng: -117.16 },
    radius: 5, // km
    type: 'Earthquake Epicenter'
  },
  {
    center: { lat: 32.75, lng: -117.18 },
    radius: 3,
    type: 'Flood Zone'
  }
];

// Display danger zones
dangerZones.forEach(zone => {
  const dangerLayer = createDangerZoneLayer(zone);
  dangerLayer.addTo(map);
});

// Check if route intersects danger
const isDangerous = routingService.routeIntersectsDangerZone(
  primaryRoute.geometry,
  dangerZones
);

if (isDangerous) {
  console.warn('⚠️ Route passes through danger zone! Use alternative.');
}
```

## Integration with Tracker

### Add to tracker.js
```javascript
import { RoutingService } from '/src/services/RoutingService.js';
import { createRouteLayer, createRouteMarkers } from '/src/utils/routeHelpers.js';

// Initialize routing service
const routingService = new RoutingService();

// Add click handler for route planning
map.on('click', async function(e) {
  // Get user's location (or use geolocation API)
  const userLocation = map.getCenter();
  
  // Calculate route to clicked location
  try {
    const routes = await routingService.calculateRoute(
      [userLocation.lng, userLocation.lat],
      [e.latlng.lng, e.latlng.lat]
    );
    
    // Display route
    const routeLayer = createRouteLayer(routes[0], true);
    routeLayer.addTo(map);
    
    // Add markers
    const { startMarker, endMarker } = createRouteMarkers(
      [userLocation.lat, userLocation.lng],
      [e.latlng.lat, e.latlng.lng]
    );
    startMarker.addTo(map);
    endMarker.addTo(map);
    
  } catch (error) {
    console.error('Failed to calculate route:', error);
  }
});
```

## Route Colors
- 🟢 **Green** - Primary/recommended route (fastest with traffic)
- 🟠 **Orange** - Alternative routes
- 🔴 **Red** - Routes through danger zones (avoid!)

## API Limits
- Mapbox Directions API has usage limits
- Free tier: 100,000 requests/month
- Consider caching routes for common evacuation points

## Next Steps
1. Add geolocation to get user's current position
2. Pre-define evacuation points for your area
3. Integrate with earthquake/weather alerts to auto-suggest routes
4. Add route comparison UI
5. Implement offline routing for emergency scenarios
