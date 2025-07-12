import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useMission } from '../context/MissionContext';
import { useApp } from '../context/AppContext';

const MissionDetailsModal: React.FC = () => {
  const { colors } = useTheme();
  const { selectedMission, showMissionDetails, setShowMissionDetails, setIsMissionActive } = useMission();
  const { state } = useApp();

  const handleStartMission = () => {
    if (!selectedMission) {
      Alert.alert('No Mission Selected', 'Please select a mission first.');
      return;
    }

    // Check if wallet is connected for minting
    if (!state.wallet.connected) {
      Alert.alert(
        'Wallet Not Connected',
        'You can still explore the AR experience, but you\'ll need to connect your wallet to mint NFTs.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Start Mission', 
            onPress: () => {
              setIsMissionActive(true);
              setShowMissionDetails(false);
            }
          }
        ]
      );
      return;
    }

    // Start the mission
    setIsMissionActive(true);
    setShowMissionDetails(false);
  };

  const handleCloseModal = () => {
    setShowMissionDetails(false);
  };

  if (!selectedMission) return null;

  return (
    <Modal
      visible={showMissionDetails}
      transparent
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Mission Details
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Mission Title */}
            <Text style={[styles.missionTitle, { color: colors.text }]}>
              {selectedMission.title}
            </Text>
            
            {/* Mission Description */}
            <Text style={[styles.missionDescription, { color: colors.textSecondary }]}>
              {selectedMission.description}
            </Text>
            
            {/* Mission Stats */}
            <View style={styles.missionStats}>
              <View style={styles.missionStat}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <Text style={[styles.missionStatText, { color: colors.text }]}>
                  {selectedMission.location.name}
                </Text>
              </View>
              
              <View style={styles.missionStat}>
                <Ionicons name="diamond" size={20} color={colors.primary} />
                <Text style={[styles.missionStatText, { color: colors.text }]}>
                  {selectedMission.nftCount} NFTs Available
                </Text>
              </View>
              
              <View style={styles.missionStat}>
                <Ionicons name="wallet" size={20} color="#FFD700" />
                <Text style={[styles.missionStatText, { color: colors.text }]}>
                  {selectedMission.reward} BONK Reward
                </Text>
              </View>
              
              <View style={styles.missionStat}>
                <Ionicons name="trophy" size={20} color={colors.primary} />
                <Text style={[styles.missionStatText, { color: colors.text }]}>
                  Difficulty: {selectedMission.difficulty}
                </Text>
              </View>
            </View>
            
            {/* Instructions */}
            <View style={styles.instructionsSection}>
              <Text style={[styles.instructionsTitle, { color: colors.text }]}>
                How to Play:
              </Text>
              <View style={styles.instructionItem}>
                <Ionicons name="location" size={16} color={colors.primary} />
                <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                  Navigate to the mission location
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="camera" size={16} color={colors.primary} />
                <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                  Point your camera at the location
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="eye" size={16} color={colors.primary} />
                <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                  Look for floating NFT indicators
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="hand-left" size={16} color={colors.primary} />
                <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                  Tap to interact with NFTs
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="wallet" size={16} color={colors.primary} />
                <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                  Mint NFTs to earn BONK rewards
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.error }]}
              onPress={handleCloseModal}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modalButton, 
                { 
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 10,
                  elevation: 10,
                }
              ]}
              onPress={handleStartMission}
            >
              <Ionicons name="camera" size={20} color={colors.text} />
              <Text style={[styles.modalButtonText, { color: colors.text }]}>
                START MISSION
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  missionDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  missionStats: {
    marginBottom: 20,
  },
  missionStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  missionStatText: {
    fontSize: 16,
    marginLeft: 10,
  },
  instructionsSection: {
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default MissionDetailsModal; 