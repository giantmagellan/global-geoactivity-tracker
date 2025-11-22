import { API_KEY } from '/src/config/config.js';

// --------------------------------------
// Routing Service for Escape Routes
// --------------------------------------
export class RoutingService {
  constructor() {
    this.baseUrl = 'https://api.mapbox.com/directions/v5/mapbox';
    this.profile = 'driving-traffic'; // Uses real-time traffic data
  }

  // --------------------------------------
  // Calculate Escape Route
  // --------------------------------------
  async calculateRoute(startCoords, endCoords, options = {}) {
    const {
      alternatives = true,  // Get multiple route options
      steps = true,         // Get turn-by-turn directions
      geometries = 'geojson',
      overview = 'full',
      annotations = 'duration,distance,speed'
    } = options;

    const coordinates = `${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}`;
    
    const url = `${this.baseUrl}/${this.profile}/${coordinates}` +
      `?alternatives=${alternatives}` +
      `&steps=${steps}` +
      `&geometries=${geometries}` +
      `&overview=${overview}` +
      `&annotations=${annotations}` +
      `&access_token=${API_KEY}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Routing API error: ${response.status}`);
      }

      const data = await response.json();
      return this.processRouteData(data);
    } catch (error) {
      console.error('Error calculating escape route:', error);
      throw error;
    }
  }

  // --------------------------------------
  // Process Route Data
  // --------------------------------------
  processRouteData(data) {
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No routes found');
    }

    return data.routes.map((route, index) => ({
      id: index,
      geometry: route.geometry,
      distance: route.distance, // meters
      duration: route.duration, // seconds
      distanceMiles: (route.distance * 0.000621371).toFixed(2),
      durationMinutes: (route.duration / 60).toFixed(1),
      steps: route.legs[0]?.steps || [],
      isPrimary: index === 0,
      trafficAware: true
    }));
  }

  // --------------------------------------
  // Get Route Instructions
  // --------------------------------------
  getRouteInstructions(route) {
    return route.steps.map((step, index) => ({
      step: index + 1,
      instruction: step.maneuver.instruction,
      distance: (step.distance * 0.000621371).toFixed(2) + ' mi',
      duration: (step.duration / 60).toFixed(1) + ' min'
    }));
  }

  // --------------------------------------
  // Calculate Multiple Evacuation Points
  // --------------------------------------
  async calculateEvacuationRoutes(currentLocation, evacuationPoints) {
    const routes = [];
    
    for (const point of evacuationPoints) {
      try {
        const route = await this.calculateRoute(
          [currentLocation.lng, currentLocation.lat],
          [point.lng, point.lat]
        );
        routes.push({
          destination: point.name,
          routes: route
        });
      } catch (error) {
        console.error(`Failed to calculate route to ${point.name}:`, error);
      }
    }

    // Sort by fastest route
    return routes.sort((a, b) => 
      a.routes[0].duration - b.routes[0].duration
    );
  }

  // --------------------------------------
  // Check if Route Intersects Danger Zone
  // --------------------------------------
  routeIntersectsDangerZone(routeGeometry, dangerZones) {
    // Simple check - can be enhanced with turf.js for precise intersection
    const routeCoords = routeGeometry.coordinates;
    
    for (const zone of dangerZones) {
      for (const coord of routeCoords) {
        if (this.isPointInDangerZone(coord, zone)) {
          return true;
        }
      }
    }
    
    return false;
  }

  // --------------------------------------
  // Check if Point is in Danger Zone
  // --------------------------------------
  isPointInDangerZone(point, zone) {
    // Simple radius check - enhance based on your danger zone format
    const [lng, lat] = point;
    const distance = this.calculateDistance(
      lat, lng,
      zone.center.lat, zone.center.lng
    );
    return distance <= zone.radius;
  }

  // --------------------------------------
  // Calculate Distance (Haversine)
  // --------------------------------------
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }
}
