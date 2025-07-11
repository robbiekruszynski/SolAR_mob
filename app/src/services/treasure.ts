import { PublicKey } from '@solana/web3.js';
import { Treasure, UserLocation } from '../types';
import { CONFIG } from './config';

export interface TreasureService {
  getNearbyTreasures(location: UserLocation): Promise<Treasure[]>;
  discoverTreasure(treasureId: string): Promise<boolean>;
  getTreasureInfo(treasureId: string): Promise<Treasure | null>;
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
}

export class MockTreasureService implements TreasureService {
  private mockTreasures: Treasure[] = [
    {
      id: '1',
      name: 'Golden Coin',
      symbol: 'GOLD',
      uri: 'https://example.com/gold-coin.json',
      location: { lat: 37.7749, lng: -122.4194 },
      bonkReward: 100,
      isFound: false,
      mintAddress: {} as PublicKey,
    },
    {
      id: '2',
      name: 'Silver Gem',
      symbol: 'SILV',
      uri: 'https://example.com/silver-gem.json',
      location: { lat: 37.7849, lng: -122.4094 },
      bonkReward: 50,
      isFound: false,
      mintAddress: {} as PublicKey,
    },
    {
      id: '3',
      name: 'Diamond Crown',
      symbol: 'DIAM',
      uri: 'https://example.com/diamond-crown.json',
      location: { lat: 37.7649, lng: -122.4294 },
      bonkReward: 200,
      isFound: false,
      mintAddress: {} as PublicKey,
    },
  ];

  async getNearbyTreasures(location: UserLocation): Promise<Treasure[]> {
    return this.mockTreasures.filter(treasure => {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        treasure.location.lat,
        treasure.location.lng
      );
      return distance <= 1000; // Within 1km
    });
  }

  async discoverTreasure(treasureId: string): Promise<boolean> {
    const treasure = this.mockTreasures.find(t => t.id === treasureId);
    if (treasure && !treasure.isFound) {
      treasure.isFound = true;
      return true;
    }
    return false;
  }

  async getTreasureInfo(treasureId: string): Promise<Treasure | null> {
    return this.mockTreasures.find(t => t.id === treasureId) || null;
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}

// Export singleton instance
export const treasureService = new MockTreasureService(); 