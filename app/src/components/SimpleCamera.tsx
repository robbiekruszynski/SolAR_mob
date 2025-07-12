import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

interface SimpleCameraProps {
  onClose: () => void;
  missionTitle?: string;
  missionDescription?: string;
}

const SimpleCamera: React.FC<SimpleCameraProps> = ({ 
  onClose, 
  missionTitle, 
  missionDescription 
}) => {
  const { colors } = useTheme();
  const { state } = useApp();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Simulate camera activation
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCapture = () => {
    if (!state.wallet.connected) {
      Alert.alert(
        'Wallet Required for Minting',
        'You need to connect your wallet to mint this NFT. You can still view the AR experience without a wallet.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Connect Wallet', 
            onPress: () => {
              Alert.alert('Wallet Connection', 'Please go to User > Wallet to connect your wallet.');
            }
          }
        ]
      );
      return;
    }

    Alert.alert(
      'NFT Discovered!',
      'You found a hidden NFT! Would you like to mint it?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mint NFT', 
          onPress: () => {
            Alert.alert('Success!', 'NFT has been minted to your wallet!');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Camera View */}
      <View style={styles.cameraContainer}>
        {/* Camera Background */}
        <View style={[styles.cameraBackground, { backgroundColor: '#000' }]}>
          {/* AR Overlay Elements */}
          <View style={styles.arOverlay}>
            {/* Reticle */}
            <View style={[styles.reticle, { borderColor: colors.primary }]}>
              <View style={[styles.reticleInner, { borderColor: colors.primary }]} />
            </View>
            
            {/* Floating AR Indicators */}
            <View style={[styles.arIndicator, { backgroundColor: colors.primary }]}>
              <Ionicons name="diamond" size={20} color={colors.text} />
              <Text style={[styles.arIndicatorText, { color: colors.text }]}>
                NFT Nearby
              </Text>
            </View>
            
            {/* Mission Info */}
            {missionTitle && (
              <View style={[styles.missionInfo, { backgroundColor: colors.surface }]}>
                <Text style={[styles.missionTitle, { color: colors.text }]}>
                  {missionTitle}
                </Text>
                {missionDescription && (
                  <Text style={[styles.missionDescription, { color: colors.textSecondary }]}>
                    {missionDescription}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Camera Controls */}
      <View style={[styles.controls, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.error }]}
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color={colors.text} />
          <Text style={[styles.controlButtonText, { color: colors.text }]}>Stop</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.captureButton, { backgroundColor: colors.primary }]}
          onPress={handleCapture}
        >
          <Ionicons name="camera" size={32} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.surfaceSecondary }]}
        >
          <Ionicons name="flash" size={24} color={colors.text} />
          <Text style={[styles.controlButtonText, { color: colors.text }]}>Flash</Text>
        </TouchableOpacity>
      </View>

      {/* Status Bar */}
      <View style={[styles.statusBar, { backgroundColor: colors.surface }]}>
        <View style={styles.statusItem}>
          <Ionicons name="location" size={16} color={colors.success} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Location Active
          </Text>
        </View>
        
        <View style={styles.statusItem}>
          <Ionicons 
            name={state.wallet.connected ? "checkmark-circle" : "close-circle"} 
            size={16} 
            color={state.wallet.connected ? colors.success : colors.error} 
          />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            {state.wallet.connected ? 'Wallet Connected' : 'No Wallet'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  cameraBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  reticle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 100,
    marginLeft: -50,
    marginTop: -50,
    borderWidth: 2,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleInner: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 30,
  },
  arIndicator: {
    position: 'absolute',
    top: 100,
    right: 20,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arIndicatorText: {
    marginLeft: 5,
    fontSize: 12,
  },
  missionInfo: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 12,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  missionDescription: {
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
  },
  controlButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 5,
    fontSize: 12,
  },
});

export default SimpleCamera; 