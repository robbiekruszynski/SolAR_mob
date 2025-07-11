import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppState, Treasure, UserLocation } from './types';
import HomeScreen from './screens/HomeScreen';
import ARScreen from './screens/ARScreen';
import MapScreen from './screens/MapScreen';
import WalletScreen from './screens/WalletScreen';

const Tab = createBottomTabNavigator();

// Mock data for development
const mockTreasures: Treasure[] = [
  {
    id: '1',
    name: 'Golden Coin',
    symbol: 'GOLD',
    uri: 'https://example.com/gold-coin.json',
    location: { lat: 37.7749, lng: -122.4194 },
    bonkReward: 100,
    isFound: false,
    mintAddress: {} as any,
  },
  {
    id: '2',
    name: 'Silver Gem',
    symbol: 'SILV',
    uri: 'https://example.com/silver-gem.json',
    location: { lat: 37.7849, lng: -122.4094 },
    bonkReward: 50,
    isFound: false,
    mintAddress: {} as any,
  },
];

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    wallet: {
      connected: false,
      publicKey: null,
      balance: 0,
      bonkBalance: 0,
    },
    currentLocation: null,
    nearbyTreasures: [],
    discoveredTreasures: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    // Initialize app
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setAppState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate location for demo
      const userLocation: UserLocation = {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
        timestamp: Date.now(),
      };

      // Find nearby treasures
      const nearby = mockTreasures.filter(treasure => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          treasure.location.lat,
          treasure.location.lng
        );
        return distance <= 1000; // Within 1km
      });

      setAppState(prev => ({
        ...prev,
        currentLocation: userLocation,
        nearbyTreasures: nearby,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setAppState(prev => ({
        ...prev,
        error: 'Failed to initialize app',
        isLoading: false,
      }));
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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
  };

  const connectWallet = async () => {
    setAppState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAppState(prev => ({
        ...prev,
        wallet: {
          ...prev.wallet,
          connected: true,
          publicKey: {} as any, // Mock public key
          balance: 1.5,
          bonkBalance: 1000,
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setAppState(prev => ({
        ...prev,
        error: 'Failed to connect wallet',
        isLoading: false,
      }));
    }
  };

  const disconnectWallet = async () => {
    setAppState(prev => ({
      ...prev,
      wallet: {
        connected: false,
        publicKey: null,
        balance: 0,
        bonkBalance: 0,
      },
    }));
  };

  const discoverTreasure = async (treasure: Treasure) => {
    if (!appState.wallet.connected) {
      Alert.alert('Wallet Required', 'Please connect your wallet to discover treasures!');
      return;
    }

    setAppState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate treasure discovery
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedTreasure = { ...treasure, isFound: true };
      
      setAppState(prev => ({
        ...prev,
        nearbyTreasures: prev.nearbyTreasures.filter(t => t.id !== treasure.id),
        discoveredTreasures: [...prev.discoveredTreasures, updatedTreasure],
        wallet: {
          ...prev.wallet,
          bonkBalance: prev.wallet.bonkBalance + treasure.bonkReward,
        },
        isLoading: false,
      }));
      
      Alert.alert(
        'Treasure Found! 🎉',
        `You discovered ${treasure.name} and earned ${treasure.bonkReward} BONK!`
      );
    } catch (error) {
      console.error('Failed to discover treasure:', error);
      setAppState(prev => ({
        ...prev,
        error: 'Failed to discover treasure',
        isLoading: false,
      }));
    }
  };

  if (appState.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading SolAR Treasure Hunt...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'AR') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Wallet') {
              iconName = focused ? 'wallet' : 'wallet-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#1A1A1A',
          },
          headerTintColor: '#FFFFFF',
          tabBarStyle: {
            backgroundColor: '#1A1A1A',
            borderTopColor: '#333333',
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'SolAR Hunt' }}
        />
        <Tab.Screen 
          name="AR" 
          component={ARScreen}
          options={{ title: 'AR Scanner' }}
        />
        <Tab.Screen 
          name="Map" 
          component={MapScreen}
          options={{ title: 'Treasure Map' }}
        />
        <Tab.Screen 
          name="Wallet" 
          component={WalletScreen}
          options={{ title: 'Wallet' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 