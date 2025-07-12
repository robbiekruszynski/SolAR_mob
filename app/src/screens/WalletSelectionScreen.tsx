import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  Modal,
  Linking,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { mobileWalletService } from '../services/MobileWalletService';

interface WalletSelectionScreenProps {
  navigation: any;
}

const WalletSelectionScreen: React.FC<WalletSelectionScreenProps> = ({ navigation }) => {
  const { connectWallet } = useApp();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const walletProviders = mobileWalletService.getWalletProviders();

  const handleWalletSelection = async (walletName: string) => {
    setSelectedWallet(walletName);
    setIsConnecting(true);

    try {
      // Check if wallet app is installed
      const provider = walletProviders.find(p => p.name === walletName);
      if (!provider) {
        throw new Error('Wallet provider not found');
      }

      // Try to open the wallet app
      const canOpen = await Linking.canOpenURL(provider.deepLink);
      if (!canOpen) {
        // If wallet app is not installed, open app store
        const appStoreUrl = getAppStoreUrl(walletName);
        Alert.alert(
          'Wallet Not Installed',
          `${walletName} is not installed. Would you like to install it?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Install', onPress: () => Linking.openURL(appStoreUrl) }
          ]
        );
        return;
      }

      // Open wallet app for connection
      await Linking.openURL(provider.deepLink);

      // Simulate wallet connection (in real app, this would use wallet adapter)
      setTimeout(async () => {
        try {
          await connectWallet(walletName);
          Alert.alert('Success', `Connected to ${walletName} wallet!`);
          navigation.goBack();
        } catch (error) {
          Alert.alert('Error', `Failed to connect to ${walletName}`);
        } finally {
          setIsConnecting(false);
          setSelectedWallet(null);
        }
      }, 2000);

    } catch (error) {
      Alert.alert('Error', `Failed to connect to ${walletName}`);
      setIsConnecting(false);
      setSelectedWallet(null);
    }
  };

  const getAppStoreUrl = (walletName: string): string => {
    const appStoreUrls = {
      'Phantom': 'https://apps.apple.com/app/phantom-crypto-wallet/id1598432977',
      'Solflare': 'https://apps.apple.com/app/solflare-wallet/id1580902717',
      'Slope': 'https://apps.apple.com/app/slope-wallet/id1574624538',
      'Backpack': 'https://apps.apple.com/app/backpack-wallet/id6443491350',
    };
    return appStoreUrls[walletName as keyof typeof appStoreUrls] || '';
  };

  const getWalletDescription = (walletName: string): string => {
    const descriptions = {
      'Phantom': 'The most popular Solana wallet with great UX',
      'Solflare': 'Fast and secure Solana wallet',
      'Slope': 'Mobile-first Solana wallet',
      'Backpack': 'Modern Solana wallet with advanced features',
    };
    return descriptions[walletName as keyof typeof descriptions] || '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Wallet</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Choose your preferred Solana wallet to connect
        </Text>

        {walletProviders.map((provider) => (
          <TouchableOpacity
            key={provider.name}
            style={[
              styles.walletOption,
              selectedWallet === provider.name && styles.selectedWallet
            ]}
            onPress={() => handleWalletSelection(provider.name)}
            disabled={isConnecting}
          >
            <View style={styles.walletInfo}>
              <Text style={styles.walletIcon}>{provider.icon}</Text>
              <View style={styles.walletDetails}>
                <Text style={styles.walletName}>{provider.name}</Text>
                <Text style={styles.walletDescription}>
                  {getWalletDescription(provider.name)}
                </Text>
              </View>
            </View>
            
            {isConnecting && selectedWallet === provider.name ? (
              <View style={styles.connectingIndicator}>
                <Ionicons name="sync" size={20} color="#FF6B35" />
                <Text style={styles.connectingText}>Connecting...</Text>
              </View>
            ) : (
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={selectedWallet === provider.name ? "#FF6B35" : "#CCCCCC"} 
              />
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#CCCCCC" />
          <Text style={styles.infoText}>
            Make sure you have the wallet app installed on your device
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 30,
  },
  walletOption: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  selectedWallet: {
    backgroundColor: '#3A3A3A',
    borderColor: '#FF6B35',
    borderWidth: 1,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  walletIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  walletDetails: {
    flex: 1,
  },
  walletName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  walletDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    marginTop: 2,
  },
  connectingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectingText: {
    color: '#FF6B35',
    fontSize: 14,
    marginLeft: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
});

export default WalletSelectionScreen; 