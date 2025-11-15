import { API_KEY, TILE_LAYER_URL, TILE_ATTRIBUTION } from '/src/config/config.js';

// --------------------------------------
// Ingestion
// --------------------------------------

// earthquake json url
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Performs GET request to the query URL using modern fetch
async function loadEarthquakeData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    createFeatures(data.features);
  } catch (error) {
    console.error('Error loading earthquake data:', error);
  }
}

loadEarthquakeData();

// --------------------------------------
// Features and Popups for Earthquakes
// --------------------------------------
function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<p>" + "Magnitude" + " " + feature.properties.mag + "</p>");
  }

  function pointToLayer(geoJsonPoint, latlng) {
    return L.circleMarker(latlng);
  }

  function style(geoJsonFeature) {
    return {
      fillColor: getColor(geoJsonFeature.properties.mag),
      color: "royalblue",
      weight: 1.5,
      fillOpacity: .25,
      radius: markerSize(geoJsonFeature.properties.mag / 1.5)
    }
  }

  function getColor(magnitude) {
    const colorScale = [
      { threshold: 6, color: "#de2c1fff" },
      { threshold: 5, color: "#e9db12ff" },
      { threshold: 4, color: "#7ee815ff" },
      { threshold: 3, color: "#18e3a0ff" },
      { threshold: 2, color: "#185bd8ff" },
      { threshold: 1, color: "#541edeff" },
      { threshold: 0, color: "#131314ff" }
    ];

    return colorScale.find(scale => magnitude > scale.threshold)?.color || "#131314ff";
  }


  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer,
    style: style
  });

  // Sends earthquakes layer to createMap function
  createMap(earthquakes);
}

// --------------------------------------
// Circles with varied radii
// --------------------------------------

function markerSize(earthquakeData) {
  return earthquakeData * 12;
}

// Arrays to hold created markers
var quakeMarkers = [];

// --------------------------------------
// Function to create earthquake map
// --------------------------------------
function createMap(earthquakes) {

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
    Earthquakes: earthquakes
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


  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(lvMap);

  // --------------------------------------
  // Title Banner
  // --------------------------------------
  const title = L.control({ position: "topleft" });

  title.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info title');
    div.innerHTML = '<h2>Global Earthquake Activity</h2><p>Real-time data from USGS</p>';
    return div;
  };

  title.addTo(lvMap);

  // --------------------------------------
  // Legend
  // --------------------------------------
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (lvmap) {
    const div = L.DomUtil.create('div', 'info legend');

    div.innerHTML = '<i style="background: #131314ff"></i><span>0-1</span><br>';
    div.innerHTML += '<i style="background: #541edeff"></i><span>1-2</span><br>';
    div.innerHTML += '<i style="background: #185bd8ff"></i><span>2-3</span><br>';
    div.innerHTML += '<i style="background: #18e3a0ff"></i><span>3-4</span><br>';
    div.innerHTML += '<i style="background: #7ee815ff"></i><span>4-5</span><br>';
    div.innerHTML += '<i style="background: #e9db12ff"></i><span>5-6</span><br>';
    div.innerHTML += '<i style="background: #de2c1fff"></i><span>6+</span><br>';


    return div;
  };

  legend.addTo(lvMap);
}
