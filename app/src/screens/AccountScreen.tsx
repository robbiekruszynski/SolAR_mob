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
import { useNavigation } from '@react-navigation/native';

interface AccountMenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  screen: string;
  color: string;
}

const AccountScreen: React.FC = () => {
  const { state, connectWallet, disconnectWallet } = useApp();
  const navigation = useNavigation<any>();
  const [showMenu, setShowMenu] = useState(false);

  const accountMenuItems: AccountMenuItem[] = [
    {
      id: 'wallet',
      title: 'Wallet',
      icon: 'wallet',
      description: 'Connect and manage your Solana wallet',
      screen: 'Wallet',
      color: '#FF6B35',
    },
    {
      id: 'dashboard',
      title: 'NFT Creator Dashboard',
      icon: 'create',
      description: 'Create and manage your NFT collections',
      screen: 'NFTCreator',
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
      id: 'trophy-room',
      title: 'Trophy Room',
      icon: 'diamond',
      description: 'View your collected NFTs',
      screen: 'TrophyRoom',
      color: '#9C27B0',
    },
    {
      id: 'collections',
      title: 'My Collections',
      icon: 'folder',
      description: 'Manage your NFT collections',
      screen: 'CollectionDetail',
      color: '#2196F3',
    },
  ];

  const handleMenuItemPress = (item: AccountMenuItem) => {
    setShowMenu(false);
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
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#FF6B35" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.username}>
              {state.wallet.connected ? 'Connected User' : 'Guest User'}
            </Text>
            <Text style={styles.walletStatus}>
              {state.wallet.connected ? 'Wallet Connected' : 'No Wallet Connected'}
            </Text>
            {state.wallet.connected && (
              <Text style={styles.balance}>
                {state.wallet.balance.toFixed(4)} SOL
              </Text>
            )}
          </View>
        </View>

        {/* Wallet Connection Status */}
        <View style={styles.walletSection}>
          {state.wallet.connected ? (
            <View style={styles.connectedWallet}>
              <View style={styles.walletInfo}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.walletAddress}>
                  {state.wallet.publicKey?.toString().slice(0, 8)}...
                  {state.wallet.publicKey?.toString().slice(-8)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.disconnectButton}
                onPress={handleDisconnectWallet}
              >
                <Ionicons name="log-out" size={20} color="#FF6B35" />
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.connectButton}
              onPress={handleConnectWallet}
            >
              <Ionicons name="wallet" size={24} color="#FFFFFF" />
              <Text style={styles.connectButtonText}>Connect Wallet</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Account Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account Features</Text>
        
        {accountMenuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(item)}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="diamond" size={24} color="#FFD700" />
            <Text style={styles.statNumber}>
              {state.wallet.connected ? '12' : '0'}
            </Text>
            <Text style={styles.statLabel}>NFTs Collected</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#FF6B35" />
            <Text style={styles.statNumber}>
              {state.wallet.connected ? '3' : '0'}
            </Text>
            <Text style={styles.statLabel}>Collections</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>
              {state.wallet.connected ? '850' : '0'}
            </Text>
            <Text style={styles.statLabel}>BONK Earned</Text>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications" size={24} color="#CCCCCC" />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="shield-checkmark" size={24} color="#CCCCCC" />
          <Text style={styles.settingText}>Privacy & Security</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="help-circle" size={24} color="#CCCCCC" />
          <Text style={styles.settingText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="information-circle" size={24} color="#CCCCCC" />
          <Text style={styles.settingText}>About</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    padding: 20,
    backgroundColor: '#2A2A2A',
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
    backgroundColor: '#2A2A2A',
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
    backgroundColor: '#2A2A2A',
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
  settingsSection: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 15,
  },
});

export default AccountScreen; 