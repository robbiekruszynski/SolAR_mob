import { PublicKey } from '@solana/web3.js';

export interface Treasure {
  id: string;
  name: string;
  symbol: string;
  uri: string;
  location: {
    lat: number;
    lng: number;
  };
  bonkReward: number;
  isFound: boolean;
  finder?: PublicKey;
  foundAt?: number;
  mintAddress: PublicKey;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface ARMarker {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  treasure: Treasure;
  isVisible: boolean;
}

export interface WalletState {
  connected: boolean;
  publicKey: PublicKey | null;
  balance: number;
  bonkBalance: number;
}

export interface AppState {
  wallet: WalletState;
  currentLocation: UserLocation | null;
  nearbyTreasures: Treasure[];
  discoveredTreasures: Treasure[];
  isLoading: boolean;
  error: string | null;
}

export type ScreenName = 'Home' | 'Map' | 'AR' | 'Wallet' | 'Treasure' | 'Settings';

export interface NavigationProps {
  navigation: any;
  route: any;
} 