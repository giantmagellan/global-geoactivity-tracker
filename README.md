# Global Geoactivity Tracker

https://giantmagellan.github.io/global-geoactivity-tracker/

## Setup Instructions

### 1. **API Key Security** ✅
- API key moved from `static/js/config.js` to `.env` file
- `.env` is now in `.gitignore` to prevent committing secrets
- API key accessed via `import.meta.env.VITE_MAPBOX_API_KEY`

### 2. **Updated Libraries** ✅
- **Leaflet**: Upgraded from `1.0.0-rc.3` → `1.9.4` (latest stable)
- **D3.js**: Removed (replaced with native `fetch()` API)
- **Vite**: Added as modern build tool

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Environment Variables

Your Mapbox API key is stored in `.env`:
```
VITE_MAPBOX_API_KEY=your_key_here
```

**Important:** Never commit the `.env` file to git. It's already in `.gitignore`.

## File Structure

```
├── .env                   # API keys (not committed)
├── .env.example           # Template for environment variables
├── src/
|   └── config/
│       └── config.js      # Imports API key from .env
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── tracker.js       # Main application tracker
└── index.html             # Entry point
```