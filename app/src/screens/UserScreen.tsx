import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

interface UserMenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  screen: string;
  color: string;
}

const UserScreen: React.FC = () => {
  const { state, connectWallet, disconnectWallet } = useApp();
  const navigation = useNavigation<any>();
  const [showMenu, setShowMenu] = useState(false);
  
  // Fallback colors in case theme is not available
  const fallbackColors = {
    primary: '#FF6B35',
    secondary: '#FFD700',
    accent: '#4CAF50',
    background: '#1A1A1A',
    surface: '#2A2A2A',
    surfaceSecondary: '#3A3A3A',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textTertiary: '#999999',
    border: '#444444',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    card: '#2A2A2A',
    cardSecondary: '#3A3A3A',
    shadow: 'rgba(0,0,0,0.3)',
    overlay: 'rgba(0,0,0,0.8)',
  };

  // Try to get theme colors, fallback to dark theme if not available
  let colors, theme, toggleTheme;
  try {
    const themeContext = useTheme();
    colors = themeContext.colors;
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch (error) {
    colors = fallbackColors;
    theme = 'dark';
    toggleTheme = () => {};
  }

  const userMenuItems: UserMenuItem[] = [
    {
      id: 'wallet',
      title: 'Wallet',
      icon: 'wallet',
      description: 'Connect and manage your Solana wallet',
      screen: 'Wallet',
      color: '#FF6B35',
    },
    {
      id: 'treasure-map',
      title: 'Treasure Map',
      icon: 'map',
      description: 'View treasure locations and discoveries',
      screen: 'TreasureMap',
      color: '#4CAF50',
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      icon: 'trophy',
      description: 'View top players and achievements',
      screen: 'Leaderboard',
      color: '#FFD700',
    },
    {
      id: 'nft-dashboard',
      title: 'NFT Dashboard',
      icon: 'create',
      description: 'Create and manage your NFT collections',
      screen: 'NFTCreator',
      color: '#4CAF50',
    },
    {
      id: 'nft-placement',
      title: 'NFT Placement',
      icon: 'location',
      description: 'Place your NFTs for explorers to discover',
      screen: 'NFTPlacement',
      color: '#9C27B0',
    },
    {
      id: 'trophies',
      title: 'Trophies & Collections',
      icon: 'diamond',
      description: 'View your collected NFTs and achievements',
      screen: 'TrophyRoom',
      color: '#9C27B0',
    },
    {
      id: 'theme',
      title: 'Theme',
      icon: theme === 'light' ? 'moon' : 'sunny',
      description: `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`,
      screen: 'Theme',
      color: '#2196F3',
    },
  ];

  const handleMenuItemPress = (item: UserMenuItem) => {
    setShowMenu(false);
    if (item.screen === 'Theme') {
      toggleTheme();
      return;
    }
    navigation.navigate(item.screen);
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      Alert.alert('Success', 'Wallet connected successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnectWallet = () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            disconnectWallet();
            Alert.alert('Wallet Disconnected', 'Your wallet has been disconnected.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#FF6B35" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.username, { color: colors.text }]}>
              {state.wallet.connected ? 'Connected User' : 'Guest User'}
            </Text>
            <Text style={[styles.walletStatus, { color: colors.textSecondary }]}>
              {state.wallet.connected ? 'Wallet Connected' : 'No Wallet Connected'}
            </Text>
            {state.wallet.connected && (
                          <Text style={[styles.balance, { color: colors.secondary }]}>
              {state.wallet.balance.toFixed(4)} SOL
            </Text>
            )}
          </View>
        </View>

        {/* Wallet Connection Status */}
        <View style={styles.walletSection}>
          {state.wallet.connected ? (
            <View style={[styles.connectedWallet, { backgroundColor: colors.surfaceSecondary }]}>
              <View style={styles.walletInfo}>
                <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                <Text style={[styles.walletAddress, { color: colors.text }]}>
                  {state.wallet.publicKey?.toString().slice(0, 8)}...
                  {state.wallet.publicKey?.toString().slice(-8)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.disconnectButton}
                onPress={handleDisconnectWallet}
              >
                <Ionicons name="log-out" size={20} color={colors.primary} />
                <Text style={[styles.disconnectButtonText, { color: colors.primary }]}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.connectButton, { backgroundColor: colors.primary }]}
              onPress={handleConnectWallet}
            >
              <Ionicons name="wallet" size={24} color="#FFFFFF" />
              <Text style={styles.connectButtonText}>Connect Wallet</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* User Menu */}
      <View style={styles.menuSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>User Features</Text>
        
        {userMenuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
            onPress={() => handleMenuItemPress(item)}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.menuDescription, { color: colors.textSecondary }]}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="diamond" size={24} color={colors.secondary} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {state.wallet.connected ? '12' : '0'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>NFTs Collected</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="trophy" size={24} color={colors.primary} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {state.wallet.connected ? '3' : '0'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Collections</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="star" size={24} color={colors.accent} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {state.wallet.connected ? '850' : '0'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>BONK Earned</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  walletStatus: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 5,
  },
  balance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  walletSection: {
    marginTop: 10,
  },
  connectedWallet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
    padding: 15,
    borderRadius: 12,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletAddress: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  disconnectButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    marginLeft: 5,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 12,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  menuSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  statsSection: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default UserScreen; 