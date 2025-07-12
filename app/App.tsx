import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { AppProvider } from './src/context/AppContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { MissionProvider } from './src/context/MissionContext';
import CustomTabBar from './src/components/CustomTabBar';
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import ARHuntingScreen from './src/screens/ARHuntingScreen';
import MapScreen from './src/screens/MapScreen';
import UserScreen from './src/screens/UserScreen';
import WalletScreen from './src/screens/WalletScreen';
import WalletSelectionScreen from './src/screens/WalletSelectionScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import NFTCreatorScreen from './src/screens/NFTCreatorScreen';
import NFTPlacementScreen from './src/screens/NFTPlacementScreen';
import TrophyRoomScreen from './src/screens/TrophyRoomScreen';
import CollectionDetailScreen from './src/screens/CollectionDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

// User Stack Navigator
const UserStack = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="UserMain" component={UserScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Wallet" component={WalletScreen} options={{ title: 'Wallet' }} />
      <Stack.Screen name="WalletSelection" component={WalletSelectionScreen} options={{ title: 'Select Wallet' }} />
      <Stack.Screen name="TreasureMap" component={MapScreen} options={{ title: 'Treasure Map' }} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Leaderboard' }} />
      <Stack.Screen name="NFTCreator" component={NFTCreatorScreen} options={{ title: 'NFT Dashboard' }} />
      <Stack.Screen name="NFTPlacement" component={NFTPlacementScreen} options={{ title: 'NFT Placement' }} />
      <Stack.Screen name="TrophyRoom" component={TrophyRoomScreen} options={{ title: 'Trophy Room' }} />
      <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} options={{ title: 'Collection' }} />
    </Stack.Navigator>
  );
};

// Main App Component with Theme Support
const MainApp: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        cardStyle: { backgroundColor: colors.background },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'SolAR Field',
          tabBarLabel: 'SolAR Field',
        }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ARHuntingScreen}
        options={{ 
          title: 'AR Explore',
          tabBarLabel: 'Explore',
        }}
      />
      <Tab.Screen 
        name="User" 
        component={UserStack}
        options={{ 
          title: 'User',
          tabBarLabel: 'User',
        }}
      />
    </Tab.Navigator>
  );
};

// Root App Component with Welcome Screen
const RootApp: React.FC = () => {
  const { colors, theme } = useTheme();

  return (
    <NavigationContainer theme={{
      dark: theme === 'dark',
      colors: {
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.primary,
      },
      fonts: {
        regular: {
          fontFamily: 'System',
          fontWeight: '400',
        },
        medium: {
          fontFamily: 'System',
          fontWeight: '500',
        },
        bold: {
          fontFamily: 'System',
          fontWeight: '700',
        },
        heavy: {
          fontFamily: 'System',
          fontWeight: '900',
        },
      },
    }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={colors.background} />
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        <RootStack.Screen name="Welcome" component={WelcomeScreen} />
        <RootStack.Screen name="MainApp" component={MainApp} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

// Root App Component with Providers
export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MissionProvider>
          <RootApp />
        </MissionProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
