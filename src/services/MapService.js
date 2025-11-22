import { API_KEY, TILE_LAYER_URL, TILE_ATTRIBUTION } from '/src/config/config.js';

// --------------------------------------
// Map Configuration Constants
// --------------------------------------
const MAP_CONFIG = {
  tileSize: 512,
  zoomOffset: -1,
  maxZoom: 18,
  defaultCenter: [32.7157, -117.1611], // Las Vegas, NV
  defaultZoom: 9
};

// --------------------------------------
// Map Service Class
// --------------------------------------
export class MapService {
  constructor() {
    this.map = null;
    this.baseMaps = {};
    this.overlayMaps = {};
  }

  // --------------------------------------
  // Create Tile Layer Helper
  // --------------------------------------
  createTileLayer(styleId) {
    return L.tileLayer(TILE_LAYER_URL, {
      attribution: TILE_ATTRIBUTION,
      tileSize: MAP_CONFIG.tileSize,
      zoomOffset: MAP_CONFIG.zoomOffset,
      maxZoom: MAP_CONFIG.maxZoom,
      id: styleId,
      accessToken: API_KEY
    });
  }

  // --------------------------------------
  // Initialize Base Maps
  // --------------------------------------
  initializeBaseMaps() {
    this.baseMaps = {
      "Dark Map": this.createTileLayer("mapbox/dark-v11"),
      "Outdoors": this.createTileLayer("mapbox/outdoors-v12"),
      "Satellite": this.createTileLayer("mapbox/satellite-streets-v12")
    };
    return this.baseMaps;
  }

  // --------------------------------------
  // Create Overlay Maps Object
  // --------------------------------------
  createOverlayMaps(earthquakes, tsunamiEarthquakes, weatherAlerts) {
    this.overlayMaps = {
      "Earthquakes": earthquakes,
      "Tsunami Warnings": tsunamiEarthquakes,
      "Weather Alerts": weatherAlerts
    };
    return this.overlayMaps;
  }

  // --------------------------------------
  // Initialize Map
  // --------------------------------------
  initializeMap(elementId, defaultLayers) {
    this.map = L.map(elementId, {
      center: MAP_CONFIG.defaultCenter,
      zoom: MAP_CONFIG.defaultZoom,
      layers: defaultLayers,
      zoomControl: false,
      worldCopyJump: true,  // Enable continuous horizontal scrolling
      maxBounds: [[-90, -Infinity], [90, Infinity]],  // Allow infinite horizontal panning
      maxBoundsViscosity: 0.0  // Allow smooth panning beyond bounds
    });

    // Add zoom control to bottom left
    L.control.zoom({
      position: 'bottomleft'
    }).addTo(this.map);

    return this.map;
  }

  // --------------------------------------
  // Add Layer Control
  // --------------------------------------
  addLayerControl() {
    const layerControl = L.control.layers(this.baseMaps, this.overlayMaps, {
      collapsed: true
    }).addTo(this.map);

    return layerControl;
  }

  // --------------------------------------
  // Get Map Instance
  // --------------------------------------
  getMap() {
    return this.map;
  }
}
