import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

interface SimpleCameraProps {
  onClose: () => void;
  missionTitle?: string;
  missionDescription?: string;
}

const SimpleCamera: React.FC<SimpleCameraProps> = ({ onClose, missionTitle, missionDescription }) => {
  const { colors } = useTheme();
  const { state } = useApp();
  // @ts-ignore
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [arObjects, setArObjects] = useState([
    { id: 1, x: 100, y: 200, type: 'nft', found: false },
    { id: 2, x: 250, y: 150, type: 'treasure', found: false },
    { id: 3, x: 180, y: 300, type: 'nft', found: false },
  ]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      // @ts-ignore
      await cameraRef.current.takePictureAsync({ quality: 0.8 });
      // Simulate finding an AR object
      const randomObject = arObjects[Math.floor(Math.random() * arObjects.length)];
      if (!randomObject.found) {
        setArObjects(prev => prev.map(obj => obj.id === randomObject.id ? { ...obj, found: true } : obj));
        if (!state.wallet.connected) {
          Alert.alert('NFT Discovered!', 'You found a hidden NFT! Connect your wallet to mint it.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Connect Wallet', onPress: () => Alert.alert('Wallet Connection', 'Please go to User > Wallet to connect your wallet.') }
          ]);
        } else {
          Alert.alert('NFT Discovered!', 'You found a hidden NFT! Would you like to mint it?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Mint NFT', onPress: () => Alert.alert('Success!', 'NFT has been minted to your wallet!') }
          ]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const toggleCameraType = () => setCameraType(t => (t === 'back' ? 'front' : 'back'));

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={{ color: colors.text }}>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={{ color: colors.text }}>No access to camera. Please enable camera permissions in your device settings.</Text>
        <TouchableOpacity style={[styles.permissionButton, { backgroundColor: colors.primary }]} onPress={onClose}>
          <Text style={{ color: colors.text }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        ratio="16:9"
      >
        {/* AR Overlay Elements */}
        <View style={styles.arOverlay} pointerEvents="box-none">
          {/* Reticle */}
          <View style={[styles.reticle, { borderColor: colors.primary }]}> 
            <View style={[styles.reticleInner, { borderColor: colors.primary }]} />
          </View>
          {/* AR Objects */}
          {arObjects.map((obj) => (
            <View
              key={obj.id}
              style={[
                styles.arObject,
                {
                  left: obj.x,
                  top: obj.y,
                  backgroundColor: obj.found ? colors.success : colors.primary,
                }
              ]}
            >
              <Ionicons name={obj.type === 'nft' ? 'diamond' : 'star'} size={24} color={colors.text} />
              {!obj.found && (
                <View style={[styles.pulse, { borderColor: colors.primary }]} />
              )}
            </View>
          ))}
          {/* Floating AR Indicators */}
          <View style={[styles.arIndicator, { backgroundColor: colors.primary }]}> 
            <Ionicons name="diamond" size={20} color={colors.text} />
            <Text style={[styles.arIndicatorText, { color: colors.text }]}>
              {arObjects.filter(obj => !obj.found).length} NFTs Nearby
            </Text>
          </View>
          {/* Mission Info */}
          {missionTitle && (
            <View style={[styles.missionInfo, { backgroundColor: colors.surface }]}> 
              <Text style={[styles.missionTitle, { color: colors.text }]}>{missionTitle}</Text>
              {missionDescription && (
                <Text style={[styles.missionDescription, { color: colors.textSecondary }]}>{missionDescription}</Text>
              )}
            </View>
          )}
        </View>
      </CameraView>
      {/* Camera Controls */}
      <View style={[styles.controls, { backgroundColor: colors.surface }]}> 
        <TouchableOpacity style={[styles.controlButton, { backgroundColor: colors.error }]} onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.text} />
          <Text style={[styles.controlButtonText, { color: colors.text }]}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.captureButton, { backgroundColor: colors.primary }]} onPress={handleCapture}>
          <Ionicons name="camera" size={32} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, { backgroundColor: colors.surfaceSecondary }]} onPress={() => Alert.alert('Flash', 'Flash functionality coming soon!')}>
          <Ionicons name="flash-off" size={24} color={colors.text} />
          <Text style={[styles.controlButtonText, { color: colors.text }]}>Flash</Text>
        </TouchableOpacity>
      </View>
      {/* Additional Controls */}
      <View style={[styles.additionalControls, { backgroundColor: colors.surface }]}> 
        <TouchableOpacity style={[styles.controlButton, { backgroundColor: colors.surfaceSecondary }]} onPress={toggleCameraType}>
          <Ionicons name="camera-reverse" size={24} color={colors.text} />
          <Text style={[styles.controlButtonText, { color: colors.text }]}>Flip</Text>
        </TouchableOpacity>
      </View>
      {/* Status Bar */}
      <View style={[styles.statusBar, { backgroundColor: colors.surface }]}> 
        <View style={styles.statusItem}>
          <Ionicons name="location" size={16} color={colors.success} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>Location Active</Text>
        </View>
        <View style={styles.statusItem}>
          <Ionicons name={state.wallet.connected ? 'checkmark-circle' : 'close-circle'} size={16} color={state.wallet.connected ? colors.success : colors.error} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>{state.wallet.connected ? 'Wallet Connected' : 'No Wallet'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  arOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
    pointerEvents: 'box-none',
  },
  reticle: {
    width: 200, height: 200, borderWidth: 2, borderRadius: 100,
    justifyContent: 'center', alignItems: 'center',
  },
  reticleInner: {
    width: 150, height: 150, borderWidth: 1, borderRadius: 75,
  },
  arObject: {
    position: 'absolute', width: 50, height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
  },
  pulse: {
    position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderStyle: 'dashed', opacity: 0.6,
  },
  arIndicator: {
    position: 'absolute', top: 100, right: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
  },
  arIndicatorText: { marginLeft: 8, fontSize: 14, fontWeight: '600' },
  missionInfo: { position: 'absolute', top: 50, left: 20, right: 20, padding: 16, borderRadius: 12, opacity: 0.9 },
  missionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  missionDescription: { fontSize: 14, opacity: 0.8 },
  controls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20 },
  controlButton: { alignItems: 'center', padding: 12, borderRadius: 12, minWidth: 60 },
  controlButtonText: { fontSize: 12, marginTop: 4, fontWeight: '600' },
  captureButton: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'rgba(255, 255, 255, 0.3)' },
  additionalControls: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 },
  statusBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 },
  statusItem: { flexDirection: 'row', alignItems: 'center' },
  statusText: { fontSize: 12, marginLeft: 4 },
  permissionButton: { marginTop: 20, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 8, alignSelf: 'center' },
});

export default SimpleCamera; 