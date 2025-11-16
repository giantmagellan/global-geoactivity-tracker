// --------------------------------------
// Weather Service for NWS API
// --------------------------------------

export class WeatherService {
  constructor() {
    this.baseUrl = "https://api.weather.gov";
    this.userAgent = "(Global GeoActivity Tracker, contact@example.com)";
  }

  async fetchActiveAlerts(area = null) {
    try {
      const url = area 
        ? `${this.baseUrl}/alerts/active?area=${area}`
        : `${this.baseUrl}/alerts/active`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent
        }
      });
      
      const data = await response.json();
      return data.features;
    } catch (error) {
      console.error('Error loading weather alert data:', error);
      throw error;
    }
  }
}
