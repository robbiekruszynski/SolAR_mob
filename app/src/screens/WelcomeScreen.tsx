import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
          <Ionicons name="diamond" size={48} color={colors.text} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          SolAR Treasure Hunt
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Discover NFTs in the real world
        </Text>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="camera" size={24} color={colors.text} />
          </View>
          <View style={styles.featureText}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              AR Camera
            </Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Use your camera to discover hidden NFTs
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="map" size={24} color={colors.text} />
          </View>
          <View style={styles.featureText}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Treasure Map
            </Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Explore locations and find rare collectibles
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="wallet" size={24} color={colors.text} />
          </View>
          <View style={styles.featureText}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Solana Wallet
            </Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Mint NFTs and earn BONK rewards
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('MainApp')}
        >
          <Text style={[styles.primaryButtonText, { color: colors.text }]}>
            Get Started
          </Text>
          <Ionicons name="arrow-forward" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('MainApp', { screen: 'User' })}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
            Connect Wallet
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Built for Solana Mobile Hackathon
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 60,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 60,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: 40,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});

export default WelcomeScreen; 