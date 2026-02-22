import { AirQualityAlert } from '../types/alert';

const API_BASE_URL = 'http://185.158.94.165:3001';

export const apiService = {
  async getRecentAlerts(): Promise<AirQualityAlert[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch recent alerts:', error);
      throw error;
    }
  },
};
