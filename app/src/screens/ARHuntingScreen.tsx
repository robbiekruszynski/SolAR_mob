import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useMission, Mission } from '../context/MissionContext';
import SimpleCamera from '../components/SimpleCamera';

const ARHuntingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { state } = useApp();
  const { selectedMission, isMissionActive, setIsMissionActive, setSelectedMission, setShowMissionDetails, showMissionDetails } = useMission();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [showLocationOverride, setShowLocationOverride] = useState(false);
  const [overrideLatitude, setOverrideLatitude] = useState('');
  const [overrideLongitude, setOverrideLongitude] = useState('');
  const [currentStep, setCurrentStep] = useState<'location' | 'mission' | 'details' | 'camera'>('location');
  const glimmerAnimation = useRef(new Animated.Value(0)).current;

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

  // Start glimmer animation when mission is selected
  useEffect(() => {
    if (selectedMission) {
      const startGlimmerAnimation = () => {
        Animated.sequence([
          Animated.timing(glimmerAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(glimmerAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ]).start(() => startGlimmerAnimation());
      };
      startGlimmerAnimation();
    }
  }, [selectedMission, glimmerAnimation]);

  // Handle mission details modal
  useEffect(() => {
    if (showMissionDetails && selectedMission) {
      // Show mission details modal
      Alert.alert(
        'Mission Details',
        `${selectedMission.title}\n\n${selectedMission.description}\n\nLocation: ${selectedMission.location.name}\nNFTs to find: ${selectedMission.nftCount}\nReward: ${selectedMission.reward} BONK\n\nTap the orange camera button again to start the mission!`,
        [
          { text: 'Cancel', onPress: () => setShowMissionDetails(false) },
          { 
            text: 'Start Mission', 
            onPress: () => {
              setShowMissionDetails(false);
              setIsMissionActive(true);
            }
          }
        ]
      );
    }
  }, [showMissionDetails, selectedMission, setShowMissionDetails, setIsMissionActive]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setCurrentStep('mission');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
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
      const mockLocation: Location.LocationObject = {
        coords: {
          latitude: parseFloat(overrideLatitude),
          longitude: parseFloat(overrideLongitude),
          altitude: null,
          accuracy: 10,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };
      setLocation(mockLocation);
      setShowLocationOverride(false);
      setOverrideLatitude('');
      setOverrideLongitude('');
      setCurrentStep('mission');
    }
  };

  const handleMissionSelect = (mission: Mission) => {
    setSelectedMission(mission);
    setCurrentStep('details');
    Alert.alert(
      'Mission Selected!',
      `${mission.title} has been selected. Tap the orange camera button to view mission details!`,
      [{ text: 'OK' }]
    );
  };

  const handleCameraButtonPress = () => {
    switch (currentStep) {
      case 'location':
        // If location not set, show location override
        if (!location) {
          setShowLocationOverride(true);
        } else {
          setCurrentStep('mission');
        }
        break;
      case 'mission':
        // If no mission selected, do nothing (user needs to select first)
        break;
      case 'details':
        // Show mission details modal
        setShowMissionDetails(true);
        break;
      case 'camera':
        // Start the camera/mission
        setIsMissionActive(true);
        break;
    }
  };

  // If mission is active, show camera
  if (isMissionActive) {
    return (
      <SimpleCamera
        onClose={() => {
          setIsMissionActive(false);
          setCurrentStep('details');
        }}
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
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {currentStep === 'location' && 'Set your location to start'}
          {currentStep === 'mission' && 'Select a mission to explore'}
          {currentStep === 'details' && 'Tap the orange button to view details'}
          {currentStep === 'camera' && 'Ready to start your mission!'}
        </Text>
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

      {/* Mission Selection - Only show when in mission step */}
      {currentStep === 'mission' && (
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
                  selectedMission?.id === mission.id && { 
                    borderColor: colors.primary, 
                    borderWidth: 3,
                    backgroundColor: colors.primary + '20',
                  }
                ]}
                onPress={() => handleMissionSelect(mission)}
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
                  {selectedMission?.id === mission.id && (
                    <View style={[styles.selectedIndicator, { backgroundColor: colors.success }]}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
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
      )}

      {/* Mission Status - Show when mission is selected */}
      {selectedMission && currentStep === 'details' && (
        <View style={styles.missionStatusContainer}>
          <Text style={[styles.missionStatusText, { color: colors.text }]}>
            Mission Selected: {selectedMission.title}
          </Text>
          <Text style={[styles.missionStatusSubtext, { color: colors.textSecondary }]}>
            Tap the orange camera button to view mission details and start exploring
          </Text>
        </View>
      )}

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
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Latitude"
              placeholderTextColor={colors.textSecondary}
              value={overrideLatitude}
              onChangeText={setOverrideLatitude}
              keyboardType="numeric"
            />
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Longitude"
              placeholderTextColor={colors.textSecondary}
              value={overrideLongitude}
              onChangeText={setOverrideLongitude}
              keyboardType="numeric"
            />
            
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
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
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
  missionStatusContainer: {
    padding: 20,
    alignItems: 'center',
  },
  missionStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  missionStatusSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ARHuntingScreen; 