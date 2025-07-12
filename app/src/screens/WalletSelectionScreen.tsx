import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { mobileWalletService } from '../services/MobileWalletService';
import { useTheme } from '../context/ThemeContext';

interface WalletSelectionScreenProps {
  navigation: any;
}

const WalletSelectionScreen: React.FC<WalletSelectionScreenProps> = ({ navigation }) => {
  const { connectWallet } = useApp();
  const { colors } = useTheme();
  const walletProviders = mobileWalletService.getWalletProviders();

  const handleWalletSelect = async (walletName: string) => {
    try {
      await connectWallet(walletName);
      Alert.alert('Success', `Connected to ${walletName} wallet!`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', `Failed to connect to ${walletName}. Please try again.`);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Select Wallet</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Choose your Solana wallet to connect
        </Text>
      </View>

      <View style={styles.walletsContainer}>
        {walletProviders.map((provider) => (
          <TouchableOpacity
            key={provider.name}
            style={[styles.walletCard, { backgroundColor: colors.surface }]}
            onPress={() => handleWalletSelect(provider.name)}
          >
            <View style={styles.walletIcon}>
              <Text style={styles.walletEmoji}>{provider.icon}</Text>
            </View>
            <View style={styles.walletInfo}>
              <Text style={[styles.walletName, { color: colors.text }]}>
                {provider.name}
              </Text>
              <Text style={[styles.walletDescription, { color: colors.textSecondary }]}>
                Connect your {provider.name} wallet
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>About Wallet Connection</Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Connecting your wallet allows you to mint NFTs and earn BONK rewards. 
          Your wallet information is stored locally and never shared with third parties.
        </Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  walletsContainer: {
    padding: 20,
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  walletIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  walletEmoji: {
    fontSize: 24,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  walletDescription: {
    fontSize: 14,
  },
  infoContainer: {
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default WalletSelectionScreen; 