import { getColor } from '/src/utils/earthquakeHelpers.js';

// --------------------------------------
// Title Banner Control
// --------------------------------------
export function createTitleControl() {
  const title = L.control({ position: "topleft" });

  title.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info title');
    div.innerHTML = '<h2>Global Geographic Activity</h2><p>Real-time data from USGS</p>';
    return div;
  };

  return title;
}

// --------------------------------------
// Info Icon Legend Control with Tooltip
// --------------------------------------
export function createLegendControl() {
  const legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    const container = L.DomUtil.create('div', 'info-icon-container');

    // Create info icon button
    const infoButton = L.DomUtil.create('div', 'info-icon', container);
    infoButton.innerHTML = '<i class="info-symbol">ℹ️</i>';
    infoButton.title = 'Click for earthquake severity legend';

    // Create tooltip content (hidden by default)
    const tooltip = L.DomUtil.create('div', 'legend-tooltip hidden', container);
    tooltip.innerHTML = `
      <h3>Earthquake Severity</h3>
      <i class="severity-solid" style="background: #541edeff"></i><span>Minor (&lt;2.5)</span><br>
      <i class="severity-solid" style="background: #185bd8ff"></i><span>Light (2.5-3.9)</span><br>
      <i class="severity-solid" style="background: #40E0D0"></i><span>Moderate (4.0-5.4)</span><br>
      <i class="severity-solid" style="background: #7ee815ff"></i><span>Strong (5.5-6.9)</span><br>
      <i class="severity-solid" style="background: #e9db12ff"></i><span>Major (7.0-7.9)</span><br>
      <i class="severity-solid" style="background: #de2c1fff"></i><span>Great (8.0+)</span><br>
      <br>
      <h3>Alert Level</h3>
      <i class="alert-ring" style="border-color: #00ff00"></i><span>No Response Needed</span><br>
      <i class="alert-ring" style="border-color: #ff8c00"></i><span>Local/Regional</span><br>
      <i class="alert-ring" style="border-color: #ffff00"></i><span>National</span><br>
      <i class="alert-ring" style="border-color: #ff0000"></i><span>International </span><br>
    `;

    // Toggle tooltip on click
    L.DomEvent.on(infoButton, 'click', function (e) {
      L.DomEvent.stopPropagation(e);
      tooltip.classList.toggle('hidden');
    });

    // Prevent map interactions when clicking on the control
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    return container;
  };

  return legend;
}

// --------------------------------------
// Setup Legend Toggle with Layer Control
// --------------------------------------
export function setupLegendToggle(map, legend) {
  map.on('overlayadd', function (eventLayer) {
    if (eventLayer.name === 'Earthquakes') {
      map.addControl(legend);
    }
  });

  map.on('overlayremove', function (eventLayer) {
    if (eventLayer.name === 'Earthquakes') {
      map.removeControl(legend);
    }
  });
}
