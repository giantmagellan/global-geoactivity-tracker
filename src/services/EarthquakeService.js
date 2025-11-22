/**
 * Service class for fetching earthquake data from USGS API
 */
export class EarthquakeService {
  constructor() {
    this.url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  }

  /**
   * Fetches earthquake data from USGS API
   * @returns {Promise<Array>} Array of earthquake features
   */
  async fetchEarthquakeData() {
    try {
      const response = await fetch(this.url);
      const data = await response.json();
      return data.features;
    } catch (error) {
      console.error('Error loading earthquake data:', error);
      throw error;
    }
  }
}
