import { UserLocation } from '../types';

export interface LocationService {
  getCurrentLocation(): Promise<UserLocation>;
  requestPermissions(): Promise<boolean>;
  watchLocation(callback: (location: UserLocation) => void): () => void;
}

export class MockLocationService implements LocationService {
  async getCurrentLocation(): Promise<UserLocation> {
    // Simulate location for demo
    return {
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 10,
      timestamp: Date.now(),
    };
  }

  async requestPermissions(): Promise<boolean> {
    // Simulate permission request
    return true;
  }

  watchLocation(callback: (location: UserLocation) => void): () => void {
    // Simulate location watching
    const interval = setInterval(() => {
      callback({
        latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
        longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
        accuracy: 10,
        timestamp: Date.now(),
      });
    }, 5000);

    return () => clearInterval(interval);
  }
}

// Export singleton instance
export const locationService = new MockLocationService(); 