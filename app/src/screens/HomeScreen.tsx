import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const { state } = useApp();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            SolAR Treasure Hunt
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Discover NFTs in the real world
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="diamond" size={32} color={colors.primary} />
            <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>NFTs Found</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="trophy" size={32} color={colors.primary} />
            <Text style={[styles.statNumber, { color: colors.text }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Missions</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="wallet" size={32} color={colors.primary} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {state.wallet.connected ? '✓' : '✗'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Wallet</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
            <Ionicons name="camera" size={24} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>Start Hunting</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surfaceSecondary }]}>
            <Ionicons name="map" size={24} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>View Map</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          
          <View style={[styles.activityItem, { backgroundColor: colors.surface }]}>
            <Ionicons name="diamond" size={20} color={colors.success} />
            <Text style={[styles.activityText, { color: colors.text }]}>
              Found Sagrada Familia NFT
            </Text>
            <Text style={[styles.activityTime, { color: colors.textSecondary }]}>2h ago</Text>
          </View>
          
          <View style={[styles.activityItem, { backgroundColor: colors.surface }]}>
            <Ionicons name="trophy" size={20} color={colors.primary} />
            <Text style={[styles.activityText, { color: colors.text }]}>
              Completed Park Güell Mission
            </Text>
            <Text style={[styles.activityTime, { color: colors.textSecondary }]}>1d ago</Text>
          </View>
          
          <View style={[styles.activityItem, { backgroundColor: colors.surface }]}>
            <Ionicons name="wallet" size={20} color={colors.success} />
            <Text style={[styles.activityText, { color: colors.text }]}>
              Connected Phantom Wallet
            </Text>
            <Text style={[styles.activityTime, { color: colors.textSecondary }]}>3d ago</Text>
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
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  activityContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 12,
  },
  activityTime: {
    fontSize: 12,
  },
});

export default HomeScreen; 