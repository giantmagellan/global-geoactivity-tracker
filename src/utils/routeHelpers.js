// --------------------------------------
// Route Visualization Helpers
// --------------------------------------

// --------------------------------------
// Style for Escape Routes
// --------------------------------------
export function getRouteStyle(routeIndex, isPrimary) {
  const styles = {
    primary: {
      color: '#00ff00',      // Green for safest/fastest route
      weight: 6,
      opacity: 0.8,
      dashArray: null
    },
    alternative: {
      color: '#ffa500',      // Orange for alternative routes
      weight: 4,
      opacity: 0.6,
      dashArray: '10, 5'
    },
    danger: {
      color: '#ff0000',      // Red for routes through danger zones
      weight: 4,
      opacity: 0.7,
      dashArray: '5, 10'
    }
  };

  return isPrimary ? styles.primary : styles.alternative;
}

// --------------------------------------
// Create Route Layer
// --------------------------------------
export function createRouteLayer(routeData, isPrimary = false) {
  const style = getRouteStyle(routeData.id, isPrimary);
  
  const routeLayer = L.geoJSON(routeData.geometry, {
    style: style
  });

  // Add popup with route info
  const popupContent = `
    <div class="route-popup">
      <h3>${isPrimary ? '🟢 Recommended Route' : '🟠 Alternative Route'}</h3>
      <p><strong>Distance:</strong> ${routeData.distanceMiles} miles</p>
      <p><strong>Est. Time:</strong> ${routeData.durationMinutes} minutes</p>
      <p><strong>Traffic:</strong> Real-time data included</p>
    </div>
  `;

  routeLayer.bindPopup(popupContent);
  
  return routeLayer;
}

// --------------------------------------
// Create Start/End Markers
// --------------------------------------
export function createRouteMarkers(startCoords, endCoords, endName = 'Destination') {
  const startIcon = L.divIcon({
    className: 'route-marker-start',
    html: '<div class="marker-pin start">📍</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

  const endIcon = L.divIcon({
    className: 'route-marker-end',
    html: '<div class="marker-pin end">🏁</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

  const startMarker = L.marker(startCoords, { icon: startIcon })
    .bindPopup('<strong>Your Location</strong>');

  const endMarker = L.marker(endCoords, { icon: endIcon })
    .bindPopup(`<strong>${endName}</strong>`);

  return { startMarker, endMarker };
}

// --------------------------------------
// Create Route Instructions Panel
// --------------------------------------
export function createInstructionsControl(instructions) {
  const control = L.control({ position: 'topleft' });

  control.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'route-instructions');
    
    div.innerHTML = '<h3>🚗 Escape Route Directions</h3>';
    div.innerHTML += '<div class="instructions-list">';
    
    instructions.forEach(step => {
      div.innerHTML += `
        <div class="instruction-step">
          <span class="step-number">${step.step}</span>
          <div class="step-details">
            <p class="step-instruction">${step.instruction}</p>
            <p class="step-meta">${step.distance} • ${step.duration}</p>
          </div>
        </div>
      `;
    });
    
    div.innerHTML += '</div>';
    
    // Prevent map interactions
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);
    
    return div;
  };

  return control;
}

// --------------------------------------
// Create Evacuation Points
// --------------------------------------
export function createEvacuationPointMarker(point) {
  const icon = L.divIcon({
    className: 'evacuation-point',
    html: '<div class="evac-marker">🏥</div>',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  const marker = L.marker([point.lat, point.lng], { icon: icon });
  
  marker.bindPopup(`
    <div class="evacuation-popup">
      <h3>🏥 ${point.name}</h3>
      <p>${point.type || 'Evacuation Point'}</p>
      <button onclick="calculateRouteToPoint(${point.lat}, ${point.lng})">
        Get Directions
      </button>
    </div>
  `);

  return marker;
}

// --------------------------------------
// Highlight Danger Zones
// --------------------------------------
export function createDangerZoneLayer(zone) {
  const circle = L.circle([zone.center.lat, zone.center.lng], {
    radius: zone.radius * 1000, // Convert km to meters
    color: '#ff0000',
    fillColor: '#ff0000',
    fillOpacity: 0.2,
    weight: 2,
    dashArray: '10, 10'
  });

  circle.bindPopup(`
    <div class="danger-zone-popup">
      <h3>⚠️ Danger Zone</h3>
      <p><strong>Type:</strong> ${zone.type}</p>
      <p><strong>Radius:</strong> ${zone.radius} km</p>
      <p><strong>Avoid this area!</strong></p>
    </div>
  `);

  return circle;
}
