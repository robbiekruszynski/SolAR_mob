import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import ARScreen from './src/screens/ARScreen';
import MapScreen from './src/screens/MapScreen';
import WalletScreen from './src/screens/WalletScreen';

const Tab = createBottomTabNavigator();

export default function App() {
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
