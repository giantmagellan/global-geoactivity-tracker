# Escape Route Planning - Quick Start Guide

## 🚨 Emergency Routing System Now Active!

Your disaster tracker now includes real-time, traffic-aware escape route planning.

## How to Use

### 1. **Plan Escape Route** 🚗
   - Click the **"🚗 Plan Escape Route"** button (top-right)
   - Button changes to **"✓ Click Destination"**
   - Click anywhere on the map to set your destination
   - System calculates multiple routes with real-time traffic

### 2. **Find Nearest Shelter** 🏥
   - Click **"🏥 Nearest Shelter"** button
   - System finds closest evacuation point
   - Shows distance and estimated time
   - Automatically displays route

### 3. **Click Evacuation Points** 
   - Click any pulsing 🏥 marker on the map
   - Instantly calculates route to that location
   - Shows turn-by-turn directions

### 4. **Clear Routes** 🗑️
   - Click **"🗑️ Clear Routes"** to remove all routes
   - Clears markers and instructions

## What You'll See

### Route Colors
- 🟢 **Green Line** - Primary/fastest route (recommended)
- 🟠 **Orange Dashed** - Alternative routes

### Markers
- 📍 **Red Pin** - Your starting location
- 🏁 **Checkered Flag** - Destination
- 🏥 **Pulsing Hospital** - Evacuation points (clickable)

### Turn-by-Turn Directions
- Appears in left panel after route calculation
- Shows each turn with distance and time
- Scrollable for long routes

## Pre-Configured Evacuation Points

Currently set for **San Diego, CA**:
1. **Emergency Shelter - North** (32.85°N, 117.15°W)
2. **Hospital - East** (32.72°N, 117.05°W)
3. **Safe Zone - West** (32.70°N, 117.25°W)

### Customize for Your Area
Edit `tracker.js` line ~110 to add your local evacuation points:

```javascript
const evacuationPoints = [
  { 
    name: 'Your Local Shelter',
    lat: YOUR_LATITUDE,
    lng: YOUR_LONGITUDE,
    type: 'Shelter'
  },
  // Add more points...
];
```

## Features

✅ **Real-Time Traffic** - Routes avoid current congestion  
✅ **Multiple Alternatives** - Shows backup routes  
✅ **Distance & Time** - Accurate estimates with traffic  
✅ **Turn-by-Turn** - Detailed navigation instructions  
✅ **Interactive** - Click map or evacuation points  
✅ **Mobile Friendly** - Works on all devices  

## Use Cases

### During Earthquake
1. Check earthquake locations on map
2. Click "Find Nearest Shelter"
3. Follow green route to safety
4. Avoid red earthquake zones

### During Weather Emergency
1. View weather alerts overlay
2. Plan route away from danger zones
3. Use alternative routes if primary blocked
4. Navigate to safe evacuation point

### Pre-Planning
1. Explore evacuation points before emergency
2. Save multiple route options
3. Identify fastest escape routes
4. Plan family meeting points

## Tips

💡 **Start Location** - Currently uses map center. For better accuracy, the system can be enhanced with browser geolocation.

💡 **Traffic Updates** - Routes use real-time traffic data from Mapbox. Recalculate if conditions change.

💡 **Alternative Routes** - Orange dashed lines show backup options if primary route becomes blocked.

💡 **Mobile Use** - Works on phones/tablets. Pinch to zoom, tap to select destination.

## API Usage

The system uses Mapbox Directions API:
- **Free Tier**: 100,000 requests/month
- **Traffic-Aware**: Uses `driving-traffic` profile
- **Alternatives**: Calculates up to 3 route options

## Next Steps

Consider adding:
- Browser geolocation for accurate starting position
- Route comparison UI
- Save favorite evacuation points
- Offline routing capability
- Integration with emergency alerts
- Share routes with family/friends

---

**Stay Safe!** This tool is designed to help you make informed decisions during emergencies. Always follow official evacuation orders and emergency services guidance.
