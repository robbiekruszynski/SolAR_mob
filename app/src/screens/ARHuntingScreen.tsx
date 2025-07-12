import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import SimpleCamera from '../components/SimpleCamera';

interface Mission {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  nftCount: number;
}

const ARHuntingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { state } = useApp();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [showLocationOverride, setShowLocationOverride] = useState(false);
  const [overrideLatitude, setOverrideLatitude] = useState('');
  const [overrideLongitude, setOverrideLongitude] = useState('');
  const [showMissionDetails, setShowMissionDetails] = useState(false);

  // Mock missions with Barcelona locations
  const mockMissions: Mission[] = [
    {
      id: '1',
      title: 'Sagrada Familia Treasure Hunt',
      description: 'Explore the iconic basilica and discover hidden NFTs',
      location: {
        latitude: 41.4036,
        longitude: 2.1744,
        name: 'Sagrada Familia'
      },
      reward: 150,
      difficulty: 'Medium',
      nftCount: 3
    },
    {
      id: '2',
      title: 'Park Güell Adventure',
      description: 'Find magical NFTs in Gaudí\'s colorful park',
      location: {
        latitude: 41.4145,
        longitude: 2.1527,
        name: 'Park Güell'
      },
      reward: 200,
      difficulty: 'Hard',
      nftCount: 5
    },
    {
      id: '3',
      title: 'La Rambla Discovery',
      description: 'Walk the famous boulevard and collect street art NFTs',
      location: {
        latitude: 41.3802,
        longitude: 2.1699,
        name: 'La Rambla'
      },
      reward: 100,
      difficulty: 'Easy',
      nftCount: 2
    },
    {
      id: '4',
      title: 'Barcelona Beach Hunt',
      description: 'Search for coastal treasures along the Mediterranean',
      location: {
        latitude: 41.3688,
        longitude: 2.1900,
        name: 'Barceloneta Beach'
      },
      reward: 120,
      difficulty: 'Easy',
      nftCount: 3
    }
  ];

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation);
        console.log('Current location:', currentLocation.coords);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get your location. You can override it for testing.');
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleLocationOverride = () => {
    if (overrideLatitude && overrideLongitude) {
      const lat = parseFloat(overrideLatitude);
      const lon = parseFloat(overrideLongitude);
      
      if (isNaN(lat) || isNaN(lon)) {
        Alert.alert('Invalid Coordinates', 'Please enter valid latitude and longitude values.');
        return;
      }

      setLocation({
        coords: {
          latitude: lat,
          longitude: lon,
          altitude: null,
          accuracy: 10,
          altitudeAccuracy: null,
          heading: null,
          speed: null
        },
        timestamp: Date.now()
      });
      
      setShowLocationOverride(false);
      Alert.alert('Location Updated', 'Your location has been updated for testing.');
    }
  };

  const handleStartExploration = async () => {
    if (!selectedMission) {
      Alert.alert('No Mission Selected', 'Please select an exploration mission first.');
      return;
    }

    // Show mission details modal first
    setShowMissionDetails(true);
  };

  const handleStartMission = async () => {
    if (!selectedMission) {
      Alert.alert('No Mission Selected', 'Please select an exploration mission first.');
      return;
    }

    // Check if user is near the mission location
    if (location) {
      const distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        selectedMission.location.latitude,
        selectedMission.location.longitude
      );

      if (distance > 2.0) { // Increased to 2km for testing
        Alert.alert(
          'Too Far Away',
          `You need to be within 2km of the mission location to start exploring. Current distance: ${distance.toFixed(2)}km`,
          [
            { text: 'Cancel' },
            { 
              text: 'Override Location', 
              onPress: () => setShowLocationOverride(true)
            }
          ]
        );
        return;
      }
    }

    // Start camera exploration - no wallet required for viewing
    setCameraActive(true);
    setShowMissionDetails(false);
  };

  if (cameraActive) {
    return (
      <SimpleCamera
        onClose={() => setCameraActive(false)}
        missionTitle={selectedMission?.title}
        missionDescription={selectedMission?.description}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          AR Explore
        </Text>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => setShowLocationOverride(true)}
        >
          <Ionicons name="location" size={20} color={colors.primary} />
          <Text style={[styles.locationText, { color: colors.textSecondary }]}>
            {location ? 'Location Set' : 'Set Location'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Location Status */}
      <View style={[styles.locationStatus, { backgroundColor: colors.surface }]}>
        <Ionicons 
          name={location ? "checkmark-circle" : "close-circle"} 
          size={20} 
          color={location ? colors.success : colors.error} 
        />
        <Text style={[styles.locationStatusText, { color: colors.textSecondary }]}>
          {location 
            ? `Location: ${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`
            : 'Location not available'
          }
        </Text>
      </View>

      {/* Mission Selection */}
      <View style={styles.missionSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Available Missions
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Select a mission to start exploring
        </Text>
        
        <ScrollView style={styles.missionList}>
          {mockMissions.map((mission) => (
            <TouchableOpacity
              key={mission.id}
              style={[
                styles.missionCard,
                { backgroundColor: colors.surface },
                selectedMission?.id === mission.id && { borderColor: colors.primary, borderWidth: 2 }
              ]}
              onPress={() => setSelectedMission(mission)}
            >
              <View style={styles.missionHeader}>
                <Text style={[styles.missionTitle, { color: colors.text }]}>
                  {mission.title}
                </Text>
                <View style={[styles.difficultyBadge, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.difficultyText, { color: colors.text }]}>
                    {mission.difficulty}
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.missionDescription, { color: colors.textSecondary }]}>
                {mission.description}
              </Text>
              
              <View style={styles.missionDetails}>
                <View style={styles.missionDetail}>
                  <Ionicons name="location" size={16} color={colors.textSecondary} />
                  <Text style={[styles.missionDetailText, { color: colors.textSecondary }]}>
                    {mission.location.name}
                  </Text>
                </View>
                
                <View style={styles.missionDetail}>
                  <Ionicons name="diamond" size={16} color={colors.primary} />
                  <Text style={[styles.missionDetailText, { color: colors.textSecondary }]}>
                    {mission.nftCount} NFTs
                  </Text>
                </View>
                
                <View style={styles.missionDetail}>
                  <Ionicons name="wallet" size={16} color="#FFD700" />
                  <Text style={[styles.missionDetailText, { color: colors.textSecondary }]}>
                    {mission.reward} BONK
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Start Exploration Button */}
      {selectedMission && (
        <TouchableOpacity
          style={[
            styles.startButton, 
            { 
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 15,
              elevation: 15,
            }
          ]}
          onPress={handleStartExploration}
          activeOpacity={0.7}
        >
          <Ionicons name="camera" size={28} color={colors.text} />
          <Text style={[styles.startButtonText, { color: colors.text }]}>
            START EXPLORATION
          </Text>
        </TouchableOpacity>
      )}

      {/* Mission Details Modal */}
      <Modal
        visible={showMissionDetails}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            {selectedMission && (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Mission Details
                </Text>
                
                <View style={styles.missionDetailsContent}>
                  <Text style={[styles.missionDetailTitle, { color: colors.text }]}>
                    {selectedMission.title}
                  </Text>
                  
                  <Text style={[styles.missionDetailDescription, { color: colors.textSecondary }]}>
                    {selectedMission.description}
                  </Text>
                  
                  <View style={styles.missionDetailStats}>
                    <View style={styles.missionDetailStat}>
                      <Ionicons name="location" size={20} color={colors.primary} />
                      <Text style={[styles.missionDetailStatText, { color: colors.text }]}>
                        {selectedMission.location.name}
                      </Text>
                    </View>
                    
                    <View style={styles.missionDetailStat}>
                      <Ionicons name="diamond" size={20} color={colors.primary} />
                      <Text style={[styles.missionDetailStatText, { color: colors.text }]}>
                        {selectedMission.nftCount} NFTs Available
                      </Text>
                    </View>
                    
                    <View style={styles.missionDetailStat}>
                      <Ionicons name="wallet" size={20} color="#FFD700" />
                      <Text style={[styles.missionDetailStatText, { color: colors.text }]}>
                        {selectedMission.reward} BONK Reward
                      </Text>
                    </View>
                    
                    <View style={styles.missionDetailStat}>
                      <Ionicons name="trophy" size={20} color={colors.primary} />
                      <Text style={[styles.missionDetailStatText, { color: colors.text }]}>
                        Difficulty: {selectedMission.difficulty}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.missionDetailInstructions}>
                    <Text style={[styles.missionDetailInstructionsTitle, { color: colors.text }]}>
                      How to Play:
                    </Text>
                    <Text style={[styles.missionDetailInstructionsText, { color: colors.textSecondary }]}>
                      • Point your camera at the location{'\n'}
                      • Look for floating NFT indicators{'\n'}
                      • Tap to interact with NFTs{'\n'}
                      • Mint NFTs to earn BONK rewards{'\n'}
                      • Complete the mission to unlock special rewards
                    </Text>
                  </View>
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.error }]}
                    onPress={() => setShowMissionDetails(false)}
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
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Location Override Modal */}
      <Modal
        visible={showLocationOverride}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Override Location
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Enter coordinates for testing purposes
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Latitude:</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                value={overrideLatitude}
                onChangeText={setOverrideLatitude}
                placeholder="41.4036"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Longitude:</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                value={overrideLongitude}
                onChangeText={setOverrideLongitude}
                placeholder="2.1744"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.error }]}
                onPress={() => setShowLocationOverride(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleLocationOverride}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Set Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    margin: 20,
  },
  locationStatusText: {
    marginLeft: 10,
    fontSize: 16,
  },
  missionSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 15,
  },
  missionList: {
    // No specific styles needed for ScrollView, content handles layout
  },
  missionCard: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 15,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  missionDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  missionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  missionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionDetailText: {
    marginLeft: 5,
    fontSize: 13,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderRadius: 12,
    width: '90%',
    maxHeight: '60%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  missionDetailsContent: {
    padding: 20,
  },
  missionDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  missionDetailDescription: {
    fontSize: 14,
    marginBottom: 15,
  },
  missionDetailStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  missionDetailStat: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  missionDetailStatText: {
    fontSize: 14,
    marginLeft: 8,
  },
  missionDetailInstructions: {
    marginTop: 15,
  },
  missionDetailInstructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  missionDetailInstructionsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ARHuntingScreen; 