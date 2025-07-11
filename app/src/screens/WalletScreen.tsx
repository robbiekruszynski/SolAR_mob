import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../services/config';

interface WalletScreenProps {
  navigation: any;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ navigation }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [solBalance, setSolBalance] = useState(0);
  const [bonkBalance, setBonkBalance] = useState(0);

  const connectWallet = async () => {
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsConnected(true);
      setWalletAddress(CONFIG.MOCK_WALLET_ADDRESS);
      setSolBalance(1.5);
      setBonkBalance(1000);
      
      Alert.alert('Success!', 'Wallet connected successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setSolBalance(0);
    setBonkBalance(0);
    Alert.alert('Disconnected', 'Wallet disconnected');
  };

  const mockTransactions = [
    {
      id: '1',
      type: 'mint',
      treasure: 'Golden Coin',
      amount: 100,
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'mint',
      treasure: 'Silver Gem',
      amount: 50,
      timestamp: '1 day ago',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
        <Text style={styles.subtitle}>Manage your Solana wallet</Text>
      </View>

      {!isConnected ? (
        <View style={styles.connectContainer}>
          <Ionicons name="wallet-outline" size={64} color="#FF6B35" />
          <Text style={styles.connectTitle}>Connect Your Wallet</Text>
          <Text style={styles.connectSubtitle}>
            Connect your Solana wallet to start hunting treasures
          </Text>
          <TouchableOpacity style={styles.connectButton} onPress={connectWallet}>
            <Ionicons name="wallet" size={24} color="#FFFFFF" />
            <Text style={styles.connectButtonText}>Connect Wallet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.walletContainer}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>Total Balance</Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <Ionicons name="logo-bitcoin" size={24} color="#FF6B35" />
                <Text style={styles.balanceAmount}>{solBalance} SOL</Text>
              </View>
              <View style={styles.balanceItem}>
                <Ionicons name="wallet" size={24} color="#FFD700" />
                <Text style={styles.balanceAmount}>{bonkBalance} BONK</Text>
              </View>
            </View>
          </View>

          <View style={styles.addressCard}>
            <Text style={styles.addressTitle}>Wallet Address</Text>
            <Text style={styles.addressText}>{walletAddress}</Text>
            <TouchableOpacity style={styles.copyButton}>
              <Ionicons name="copy-outline" size={16} color="#FF6B35" />
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsContainer}>
            <Text style={styles.transactionsTitle}>Recent Activity</Text>
            {mockTransactions.map((tx) => (
              <View key={tx.id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Ionicons 
                    name="diamond" 
                    size={20} 
                    color="#FFD700" 
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>
                    Minted {tx.treasure}
                  </Text>
                  <Text style={styles.transactionTime}>{tx.timestamp}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={styles.amountText}>+{tx.amount} BONK</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.disconnectButton} onPress={disconnectWallet}>
            <Ionicons name="log-out-outline" size={20} color="#FF6B35" />
            <Text style={styles.disconnectButtonText}>Disconnect Wallet</Text>
          </TouchableOpacity>
        </View>
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 5,
  },
  connectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  connectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    textAlign: 'center',
  },
  connectSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  connectButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  walletContainer: {
    padding: 20,
  },
  balanceCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  balanceTitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 15,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  addressCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  addressTitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 10,
  },
  addressText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  copyButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    marginLeft: 5,
  },
  transactionsContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  transactionsTitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  transactionIcon: {
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  transactionTime: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  disconnectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF6B35',
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnectButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default WalletScreen; 