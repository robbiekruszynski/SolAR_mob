import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { state, connectWallet } = useApp();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SolAR Treasure Hunt</Text>
        <Text style={styles.subtitle}>Discover AR NFTs in the real world</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color="#FFD700" />
          <Text style={styles.statNumber}>{state.discoveredTreasures.length}</Text>
          <Text style={styles.statLabel}>Treasures Found</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="wallet" size={24} color="#FF6B35" />
          <Text style={styles.statNumber}>{state.wallet.bonkBalance}</Text>
          <Text style={styles.statLabel}>BONK Earned</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#4CAF50" />
          <Text style={styles.statNumber}>
            {state.leaderboard.stats?.totalPlayers || 0}
          </Text>
          <Text style={styles.statLabel}>Players</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('AR')}
        >
          <Ionicons name="camera" size={32} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Start AR Hunt</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('Map')}
        >
          <Ionicons name="map" size={32} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>View Treasure Map</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('Wallet', { screen: 'WalletSelection' })}
        >
          <Ionicons name="wallet" size={32} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>
            {state.wallet.connected ? 'Manage Wallet' : 'Connect Wallet'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <Ionicons name="trophy" size={32} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>View Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('Creator')}
        >
          <Ionicons name="create" size={32} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Create NFTs</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How to Play</Text>
        <View style={styles.infoItem}>
          <Ionicons name="location" size={20} color="#FF6B35" />
          <Text style={styles.infoText}>Walk around to find treasure locations</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="camera" size={20} color="#FF6B35" />
          <Text style={styles.infoText}>Use AR to scan and discover treasures</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="wallet" size={20} color="#FF6B35" />
          <Text style={styles.infoText}>Mint NFTs and earn BONK rewards</Text>
        </View>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 4,
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#FF6B35',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: '#2A2A2A',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    color: '#CCCCCC',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
});

export default HomeScreen; 