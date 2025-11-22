// Secrets
export const API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

// Environment variables
export const TILE_LAYER_URL = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
export const TILE_ATTRIBUTION = "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>";

// Mapbox Traffic layer (raster tiles for Leaflet compatibility)
export const TRAFFIC_V1_TILE_LAYER_URL = "https://api.mapbox.com/v4/mapbox.mapbox-traffic-v1/{z}/{x}/{y}.png?access_token={accessToken}";
