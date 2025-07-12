import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Treasure, UserLocation } from '../types';
import { walletService } from '../services/wallet';
import { treasureService } from '../services/treasure';
import { locationService } from '../services/location';
import { leaderboardService } from '../services/leaderboard';
import { nftCreatorService } from '../services/nftCreator';
import { CONFIG, validateConfig } from '../services/config';

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_LOCATION'; payload: UserLocation }
  | { type: 'SET_NEARBY_TREASURES'; payload: Treasure[] }
  | { type: 'SET_DISCOVERED_TREASURES'; payload: Treasure[] }
  | { type: 'UPDATE_WALLET_STATE'; payload: any }
  | { type: 'DISCOVER_TREASURE'; payload: string }
  | { type: 'SET_LEADERBOARD_PLAYERS'; payload: any[] }
  | { type: 'SET_LEADERBOARD_STATS'; payload: any }
  | { type: 'SET_LEADERBOARD_LOADING'; payload: boolean }
  | { type: 'SET_LEADERBOARD_ERROR'; payload: string | null }
  | { type: 'SET_NFT_CREATOR_COLLECTIONS'; payload: any[] }
  | { type: 'SET_NFT_CREATOR_STATS'; payload: any }
  | { type: 'SET_NFT_CREATOR_LOADING'; payload: boolean }
  | { type: 'SET_NFT_CREATOR_ERROR'; payload: string | null };

// Initial state
const initialState: AppState = {
  wallet: {
    connected: false,
    publicKey: null,
    balance: 0,
    bonkBalance: 0,
  },
  currentLocation: null,
  nearbyTreasures: [],
  discoveredTreasures: [],
  leaderboard: {
    players: [],
    stats: null,
    loading: false,
    error: null,
  },
  nftCreator: {
    collections: [],
    stats: null,
    loading: false,
    error: null,
  },
  isLoading: false,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENT_LOCATION':
      return { ...state, currentLocation: action.payload };
    case 'SET_NEARBY_TREASURES':
      return { ...state, nearbyTreasures: action.payload };
    case 'SET_DISCOVERED_TREASURES':
      return { ...state, discoveredTreasures: action.payload };
    case 'UPDATE_WALLET_STATE':
      return { ...state, wallet: { ...state.wallet, ...action.payload } };
    case 'DISCOVER_TREASURE':
      const treasure = state.nearbyTreasures.find(t => t.id === action.payload);
      if (treasure) {
        const updatedTreasure = { ...treasure, isFound: true };
        return {
          ...state,
          nearbyTreasures: state.nearbyTreasures.filter(t => t.id !== action.payload),
          discoveredTreasures: [...state.discoveredTreasures, updatedTreasure],
          wallet: {
            ...state.wallet,
            bonkBalance: state.wallet.bonkBalance + (treasure.bonkReward || 0),
          },
        };
      }
      return state;
    case 'SET_LEADERBOARD_PLAYERS':
      return {
        ...state,
        leaderboard: { ...state.leaderboard, players: action.payload },
      };
    case 'SET_LEADERBOARD_STATS':
      return {
        ...state,
        leaderboard: { ...state.leaderboard, stats: action.payload },
      };
    case 'SET_LEADERBOARD_LOADING':
      return {
        ...state,
        leaderboard: { ...state.leaderboard, loading: action.payload },
      };
    case 'SET_LEADERBOARD_ERROR':
      return {
        ...state,
        leaderboard: { ...state.leaderboard, error: action.payload },
      };
    case 'SET_NFT_CREATOR_COLLECTIONS':
      return {
        ...state,
        nftCreator: { ...state.nftCreator, collections: action.payload },
      };
    case 'SET_NFT_CREATOR_STATS':
      return {
        ...state,
        nftCreator: { ...state.nftCreator, stats: action.payload },
      };
    case 'SET_NFT_CREATOR_LOADING':
      return {
        ...state,
        nftCreator: { ...state.nftCreator, loading: action.payload },
      };
    case 'SET_NFT_CREATOR_ERROR':
      return {
        ...state,
        nftCreator: { ...state.nftCreator, error: action.payload },
      };
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  discoverTreasure: (treasureId: string) => Promise<void>;
  initializeApp: () => Promise<void>;
  loadLeaderboard: () => Promise<void>;
  updatePlayerMint: (walletAddress: string, bonkEarned: number) => Promise<void>;
  loadNFTCreatorData: () => Promise<void>;
  createCollection: (collectionData: any) => Promise<void>;
  deployCollection: (collectionId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const connectWallet = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const publicKey = await walletService.connect();
      const balance = await walletService.getBalance();
      const bonkBalance = await walletService.getBonkBalance();
      
      dispatch({
        type: 'UPDATE_WALLET_STATE',
        payload: {
          connected: true,
          publicKey,
          balance,
          bonkBalance,
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to connect wallet' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const disconnectWallet = async () => {
    try {
      await walletService.disconnect();
      dispatch({
        type: 'UPDATE_WALLET_STATE',
        payload: {
          connected: false,
          publicKey: null,
          balance: 0,
          bonkBalance: 0,
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to disconnect wallet' });
    }
  };

  const discoverTreasure = async (treasureId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simulate treasure discovery
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      dispatch({ type: 'DISCOVER_TREASURE', payload: treasureId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to discover treasure' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadLeaderboard = async () => {
    try {
      dispatch({ type: 'SET_LEADERBOARD_LOADING', payload: true });
      const players = await leaderboardService.getTopPlayers(15);
      const stats = await leaderboardService.getLeaderboardStats();
      dispatch({ type: 'SET_LEADERBOARD_PLAYERS', payload: players });
      dispatch({ type: 'SET_LEADERBOARD_STATS', payload: stats });
    } catch (error) {
      dispatch({ type: 'SET_LEADERBOARD_ERROR', payload: 'Failed to load leaderboard' });
    } finally {
      dispatch({ type: 'SET_LEADERBOARD_LOADING', payload: false });
    }
  };

  const updatePlayerMint = async (walletAddress: string, bonkEarned: number) => {
    try {
      await leaderboardService.updatePlayerMint(walletAddress, bonkEarned);
      // Reload leaderboard to reflect changes
      await loadLeaderboard();
    } catch (error) {
      console.error('Failed to update player mint:', error);
    }
  };

  const loadNFTCreatorData = async () => {
    if (!state.wallet.publicKey) return;
    
    try {
      dispatch({ type: 'SET_NFT_CREATOR_LOADING', payload: true });
      const collections = await nftCreatorService.getUserCollections(
        state.wallet.publicKey.toString()
      );
      const stats = await nftCreatorService.getCreatorStats(
        state.wallet.publicKey.toString()
      );
      
      dispatch({ type: 'SET_NFT_CREATOR_COLLECTIONS', payload: collections });
      dispatch({ type: 'SET_NFT_CREATOR_STATS', payload: stats });
    } catch (error) {
      dispatch({ type: 'SET_NFT_CREATOR_ERROR', payload: 'Failed to load NFT creator data' });
    } finally {
      dispatch({ type: 'SET_NFT_CREATOR_LOADING', payload: false });
    }
  };

  const createCollection = async (collectionData: any) => {
    if (!state.wallet.publicKey) {
      throw new Error('Wallet not connected');
    }
    
    try {
      dispatch({ type: 'SET_NFT_CREATOR_LOADING', payload: true });
      await nftCreatorService.createCollection({
        ...collectionData,
        creator: state.wallet.publicKey.toString(),
      });
      await loadNFTCreatorData();
    } catch (error) {
      dispatch({ type: 'SET_NFT_CREATOR_ERROR', payload: 'Failed to create collection' });
      throw error;
    } finally {
      dispatch({ type: 'SET_NFT_CREATOR_LOADING', payload: false });
    }
  };

  const deployCollection = async (collectionId: string) => {
    try {
      dispatch({ type: 'SET_NFT_CREATOR_LOADING', payload: true });
      await nftCreatorService.deployCollection(collectionId);
      await loadNFTCreatorData();
    } catch (error) {
      dispatch({ type: 'SET_NFT_CREATOR_ERROR', payload: 'Failed to deploy collection' });
      throw error;
    } finally {
      dispatch({ type: 'SET_NFT_CREATOR_LOADING', payload: false });
    }
  };

  const initializeApp = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Validate configuration
      validateConfig();
      
      // Get current location
      const hasPermission = await locationService.requestPermissions();
      if (!hasPermission) {
        dispatch({ type: 'SET_ERROR', payload: 'Location permission denied' });
        return;
      }
      
      const location = await locationService.getCurrentLocation();
      dispatch({ type: 'SET_CURRENT_LOCATION', payload: location });
      
      // Get nearby treasures
      const nearbyTreasures = await treasureService.getNearbyTreasures(location);
      dispatch({ type: 'SET_NEARBY_TREASURES', payload: nearbyTreasures });
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize app' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    connectWallet,
    disconnectWallet,
    discoverTreasure,
    initializeApp,
    loadLeaderboard,
    updatePlayerMint,
    loadNFTCreatorData,
    createCollection,
    deployCollection,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 