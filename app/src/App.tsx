import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppProvider } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { MissionProvider, useMission } from './context/MissionContext';
import HomeScreen from './screens/HomeScreen';
import ARHuntingScreen from './screens/ARHuntingScreen';
import MapScreen from './screens/MapScreen';
import UserScreen from './screens/UserScreen';
import WalletScreen from './screens/WalletScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import TrophyRoomScreen from './screens/TrophyRoomScreen';
import NFTCreatorScreen from './screens/NFTCreatorScreen';
import NFTPlacementScreen from './screens/NFTPlacementScreen';
import CollectionDetailScreen from './screens/CollectionDetailScreen';
import MissionDetailsModal from './components/MissionDetailsModal';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// User Stack Navigator
const UserStack = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="UserMain" component={UserScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Wallet" component={WalletScreen} options={{ title: 'Wallet' }} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Leaderboard' }} />
      <Stack.Screen name="NFTCreator" component={NFTCreatorScreen} options={{ title: 'NFT Dashboard' }} />
      <Stack.Screen name="NFTPlacement" component={NFTPlacementScreen} options={{ title: 'NFT Placement' }} />
      <Stack.Screen name="TrophyRoom" component={TrophyRoomScreen} options={{ title: 'Trophy Room' }} />
      <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} options={{ title: 'Collection' }} />
    </Stack.Navigator>
  );
};

// Simple Camera Tab Button that doesn't use context
const CameraTabButton: React.FC<{ onPress: () => void; focused: boolean }> = ({ onPress, focused }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.cameraTabButton,
        {
          backgroundColor: focused ? colors.primary : colors.surface,
          // Add a subtle indicator when focused (mission might be selected)
          borderWidth: focused ? 2 : 0,
          borderColor: focused ? '#FFD700' : 'transparent',
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={focused ? 'camera' : 'camera-outline'} 
        size={24} 
        color={focused ? colors.text : colors.textSecondary} 
      />
    </TouchableOpacity>
  );
};

// Main App Component with Theme Support
const MainApp: React.FC = () => {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Camera') {
              // Custom camera tab button
              return <CameraTabButton onPress={() => {}} focused={focused} />;
            } else if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'User') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'SolAR Hunt' }}
        />
        <Tab.Screen 
          name="Camera" 
          component={ARHuntingScreen}
          options={{ title: 'AR Hunting' }}
        />
        <Tab.Screen 
          name="Map" 
          component={MapScreen}
          options={{ title: 'Treasure Map' }}
        />
        <Tab.Screen 
          name="User" 
          component={UserStack}
          options={{ title: 'User' }}
        />
      </Tab.Navigator>
      
      {/* Mission Details Modal */}
      <MissionDetailsModal />
    </NavigationContainer>
  );
};

// Root App Component with all providers
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <MissionProvider>
          <MainApp />
        </MissionProvider>
      </AppProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  cameraTabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    minWidth: 120,
  },
});

export default App; 