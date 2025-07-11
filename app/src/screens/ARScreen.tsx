import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ARScreenProps {
  navigation: any;
}

const ARScreen: React.FC<ARScreenProps> = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScanTreasure = () => {
    if (isScanning) return;
    
    setIsScanning(true);
    Alert.alert(
      'Treasure Found! 🎉',
      'You discovered a treasure! Would you like to mint the NFT?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setIsScanning(false),
        },
        {
          text: 'Mint NFT',
          onPress: () => {
            // Simulate NFT minting
            setTimeout(() => {
              Alert.alert('Success!', 'NFT minted successfully! You earned 100 BONK!');
              setIsScanning(false);
            }, 2000);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>AR Scanner</Text>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => Alert.alert('Camera', 'Camera functionality coming soon!')}
          >
            <Ionicons name="camera-reverse" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
          <Text style={styles.scanText}>Point camera at treasure markers</Text>
          <Text style={styles.scanSubtext}>AR functionality coming soon!</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={handleScanTreasure}
          >
            <Ionicons 
              name="scan" 
              size={32} 
              color="#FFFFFF" 
            />
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Scanning...' : 'Scan for Treasures'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  headerButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FF6B35',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FF6B35',
    top: -2,
    left: -2,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  cornerBottomLeft: {
    bottom: -2,
    top: 'auto',
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    top: 'auto',
    left: 'auto',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  scanSubtext: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 6,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  button: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ARScreen; 