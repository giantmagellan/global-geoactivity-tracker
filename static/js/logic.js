import { API_KEY, TILE_LAYER_URL, TILE_ATTRIBUTION } from '/src/config/config.js';

// --------------------------------------
// Import data into JS
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
    switch (true) {
      case magnitude > 6:
        return "#de2c1fff";
      case magnitude > 5:
        return "#e9db12ff";
      case magnitude > 4:
        return "#7ee815ff";
      case magnitude > 3:
        return "#18e3a0ff";
      case magnitude > 2:
        return "#185bd8ff";
      case magnitude > 1:
        return "#541edeff";
      default:
        return "#131314ff";
    }
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
    // "Street Map": streetmap,
    "Dark Map": darkmap,
    "Outdoors": outdoors,
    "Satellite": satellite
    // "Grayscale": grayscale
  };

  // Overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Inital map object with central coordinates at Las Vegas, NV
  var lvMap = L.map("map", {
    center: [36.17, -115.14],
    zoom: 5,
    layers: [darkmap, quakes, earthquakes]
  });


  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(lvMap);

  // --------------------------------------
  // Legend
  // --------------------------------------
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (lvmap) {
    var div = L.DomUtil.create('div', 'info legend')
    grades = [0, 1, 2, 3, 4, 5, 6]

    div.innerHTML += '<i style="background: #131314ff"></i><span>0-1</span><br>';
    div.innerHTML += '<i style="background: #541edeff"></i><span>1-2</span><br>';
    div.innerHTML += '<i style="background: #185bd8ff"></i><span>2-3</span><br>';
    div.innerHTML += '<i style="background: #18e3a0ff"></i><span>3-4</span><br>';
    div.innerHTML += '<i style="background: #7ee815ff"></i><span>4-5</span><br>';
    div.innerHTML += '<i style="background: #e9db12ff"></i><span>5-6</span><br>';
    div.innerHTML += '<i style="background: #de2c1fff"></i><span>6+</span><br>';

    // for (var i = 0; i < grades.length; i++) {
    //   div.innerHTML += ‘<i style=”background:’ + getColor(grades[i] + 1) + ‘”></i> ‘ + grades[i] + (grades[i + 1] ? ‘&ndash;’ + grades[i + 1] + ‘<br>’ : ‘+’);
    //   }


    return div;
  };

  legend.addTo(lvMap);
}
