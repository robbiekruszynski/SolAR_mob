import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

interface Venue {
  id: string;
  name: string;
  description: string;
  image: string;
  floorPlan: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  capacity: number;
  eventType: string;
}

interface NFTPlacement {
  id: string;
  name: string;
  description: string;
  image: string;
  collection: string;
  price: number;
  reward: number;
  location: {
    latitude: number;
    longitude: number;
    venue: string;
    floorArea?: string;
  };
  creator: string;
  createdAt: string;
}

const NFTPlacementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { state } = useApp();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [showARPlacement, setShowARPlacement] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [nftPrice, setNftPrice] = useState('');
  const [nftReward, setNftReward] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');

  // Mock venues
  const venues: Venue[] = [
    {
      id: '1',
      name: 'ETHDenver 2024',
      description: 'The largest Ethereum hackathon and conference in the world',
      image: 'https://via.placeholder.com/300/FF6B35/FFFFFF?text=ETHDenver',
      floorPlan: 'https://via.placeholder.com/400/2A2A2A/FFFFFF?text=Floor+Plan',
      location: {
        latitude: 39.7392,
        longitude: -104.9903,
        address: 'Denver, Colorado, USA'
      },
      capacity: 5000,
      eventType: 'Hackathon'
    },
    {
      id: '2',
      name: 'Consensus 2024',
      description: 'The world\'s largest blockchain and crypto conference',
      image: 'https://via.placeholder.com/300/4CAF50/FFFFFF?text=Consensus',
      floorPlan: 'https://via.placeholder.com/400/2A2A2A/FFFFFF?text=Floor+Plan',
      location: {
        latitude: 30.2672,
        longitude: -97.7431,
        address: 'Austin, Texas, USA'
      },
      capacity: 15000,
      eventType: 'Conference'
    },
    {
      id: '3',
      name: 'NFT NYC 2024',
      description: 'The premier NFT conference and exhibition',
      image: 'https://via.placeholder.com/300/2196F3/FFFFFF?text=NFT+NYC',
      floorPlan: 'https://via.placeholder.com/400/2A2A2A/FFFFFF?text=Floor+Plan',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'New York, NY, USA'
      },
      capacity: 8000,
      eventType: 'Exhibition'
    },
    {
      id: '4',
      name: 'Custom Location',
      description: 'Place NFTs anywhere in the world using AR',
      image: 'https://via.placeholder.com/300/9C27B0/FFFFFF?text=Custom',
      floorPlan: 'https://via.placeholder.com/400/2A2A2A/FFFFFF?text=AR+View',
      location: {
        latitude: 0,
        longitude: 0,
        address: 'Anywhere'
      },
      capacity: 0,
      eventType: 'AR Placement'
    }
  ];

  // Mock NFT collections
  const collections = [
    'CryptoPunks',
    'Bored Ape Yacht Club',
    'Doodles',
    'Azuki',
    'Moonbirds',
    'Custom Collection'
  ];

  // Mock existing placements
  const existingPlacements: NFTPlacement[] = [
    {
      id: '1',
      name: 'Golden Ticket',
      description: 'Exclusive access to VIP areas',
      image: 'https://via.placeholder.com/150/FFD700/000000?text=VIP',
      collection: 'Event Passes',
      price: 0.5,
      reward: 100,
      location: {
        latitude: 39.7392,
        longitude: -104.9903,
        venue: 'ETHDenver 2024',
        floorArea: 'Main Hall'
      },
      creator: state.wallet.publicKey?.toString() || 'Unknown',
      createdAt: '2024-01-15'
    }
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setCurrentLocation(location);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleVenueSelect = (venue: Venue) => {
    setSelectedVenue(venue);
    setShowVenueModal(false);
  };

  const handleStartPlacement = () => {
    if (!selectedVenue) {
      Alert.alert('No Venue Selected', 'Please select a venue first.');
      return;
    }

    if (selectedVenue.id === '4') {
      // Custom AR placement
      setShowARPlacement(true);
    } else {
      // Venue-based placement
      setShowPlacementModal(true);
    }
  };

  const handleCreateNFT = () => {
    if (!nftName || !nftDescription || !nftPrice || !nftReward) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    // Here you would typically mint the NFT on-chain
    Alert.alert(
      'NFT Created Successfully!',
      `Your NFT "${nftName}" has been placed at ${selectedVenue?.name}`,
      [
        { text: 'OK', onPress: () => {
          setShowPlacementModal(false);
          setShowARPlacement(false);
          // Reset form
          setNftName('');
          setNftDescription('');
          setNftPrice('');
          setNftReward('');
          setSelectedCollection('');
        }}
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          NFT Placement
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Create and place NFTs at events or custom locations
        </Text>
      </View>

      {/* Venue Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Select Venue
        </Text>
        
        {selectedVenue ? (
          <TouchableOpacity
            style={[styles.selectedVenue, { backgroundColor: colors.surface }]}
            onPress={() => setShowVenueModal(true)}
          >
            <Image source={{ uri: selectedVenue.image }} style={styles.venueImage} />
            <View style={styles.venueInfo}>
              <Text style={[styles.venueName, { color: colors.text }]}>
                {selectedVenue.name}
              </Text>
              <Text style={[styles.venueDescription, { color: colors.textSecondary }]}>
                {selectedVenue.description}
              </Text>
              <Text style={[styles.venueLocation, { color: colors.primary }]}>
                📍 {selectedVenue.location.address}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.selectVenueButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowVenueModal(true)}
          >
            <Ionicons name="location" size={24} color={colors.text} />
            <Text style={[styles.selectVenueText, { color: colors.text }]}>
              Select Venue
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Floor Plan Preview */}
      {selectedVenue && selectedVenue.id !== '4' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Floor Plan
          </Text>
          <View style={[styles.floorPlanContainer, { backgroundColor: colors.surface }]}>
            <Image source={{ uri: selectedVenue.floorPlan }} style={styles.floorPlanImage} />
            <View style={styles.floorPlanOverlay}>
              <Text style={[styles.floorPlanText, { color: colors.text }]}>
                {selectedVenue.name} Floor Plan
              </Text>
              <Text style={[styles.floorPlanSubtext, { color: colors.textSecondary }]}>
                Tap areas to place NFTs
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* AR Placement Option */}
      {selectedVenue && selectedVenue.id === '4' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            AR Placement
          </Text>
          <View style={[styles.arPlacementContainer, { backgroundColor: colors.surface }]}>
            <Ionicons name="camera" size={48} color={colors.primary} />
            <Text style={[styles.arPlacementTitle, { color: colors.text }]}>
              AR Camera Placement
            </Text>
            <Text style={[styles.arPlacementDescription, { color: colors.textSecondary }]}>
              Use your camera to place NFTs in the real world
            </Text>
          </View>
        </View>
      )}

      {/* Existing Placements */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Your Placements
        </Text>
        {existingPlacements.map((placement) => (
          <View key={placement.id} style={[styles.placementCard, { backgroundColor: colors.surface }]}>
            <Image source={{ uri: placement.image }} style={styles.placementImage} />
            <View style={styles.placementInfo}>
              <Text style={[styles.placementName, { color: colors.text }]}>
                {placement.name}
              </Text>
              <Text style={[styles.placementDescription, { color: colors.textSecondary }]}>
                {placement.description}
              </Text>
              <View style={styles.placementDetails}>
                <Text style={[styles.placementDetail, { color: colors.primary }]}>
                  💰 {placement.price} SOL
                </Text>
                <Text style={[styles.placementDetail, { color: '#FFD700' }]}>
                  🏆 {placement.reward} BONK
                </Text>
              </View>
              <Text style={[styles.placementLocation, { color: colors.textSecondary }]}>
                📍 {placement.location.venue}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Start Placement Button */}
      {selectedVenue && (
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.primary }]}
          onPress={handleStartPlacement}
        >
          <Ionicons name="add-circle" size={24} color={colors.text} />
          <Text style={[styles.startButtonText, { color: colors.text }]}>
            Start NFT Placement
          </Text>
        </TouchableOpacity>
      )}

      {/* Venue Selection Modal */}
      <Modal
        visible={showVenueModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Venue
            </Text>
            
            <ScrollView style={styles.venueList}>
              {venues.map((venue) => (
                <TouchableOpacity
                  key={venue.id}
                  style={[styles.venueOption, { backgroundColor: colors.background }]}
                  onPress={() => handleVenueSelect(venue)}
                >
                  <Image source={{ uri: venue.image }} style={styles.venueOptionImage} />
                  <View style={styles.venueOptionInfo}>
                    <Text style={[styles.venueOptionName, { color: colors.text }]}>
                      {venue.name}
                    </Text>
                    <Text style={[styles.venueOptionDescription, { color: colors.textSecondary }]}>
                      {venue.description}
                    </Text>
                    <Text style={[styles.venueOptionLocation, { color: colors.primary }]}>
                      📍 {venue.location.address}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.error }]}
              onPress={() => setShowVenueModal(false)}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* NFT Creation Modal */}
      <Modal
        visible={showPlacementModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Create NFT
            </Text>
            
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>NFT Name:</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                  value={nftName}
                  onChangeText={setNftName}
                  placeholder="Enter NFT name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Description:</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                  value={nftDescription}
                  onChangeText={setNftDescription}
                  placeholder="Enter description"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Collection:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {collections.map((collection) => (
                    <TouchableOpacity
                      key={collection}
                      style={[
                        styles.collectionChip,
                        { backgroundColor: selectedCollection === collection ? colors.primary : colors.background }
                      ]}
                      onPress={() => setSelectedCollection(collection)}
                    >
                      <Text style={[styles.collectionChipText, { color: colors.text }]}>
                        {collection}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Price (SOL):</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                    value={nftPrice}
                    onChangeText={setNftPrice}
                    placeholder="0.1"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Reward (BONK):</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                    value={nftReward}
                    onChangeText={setNftReward}
                    placeholder="100"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.error }]}
                onPress={() => setShowPlacementModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleCreateNFT}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Create NFT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* AR Placement Modal */}
      <Modal
        visible={showARPlacement}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              AR NFT Placement
            </Text>
            
            <View style={styles.arPlacementInfo}>
              <Ionicons name="camera" size={64} color={colors.primary} />
              <Text style={[styles.arPlacementTitle, { color: colors.text }]}>
                Point your camera at the location where you want to place the NFT
              </Text>
              <Text style={[styles.arPlacementDescription, { color: colors.textSecondary }]}>
                The NFT will be anchored to that location in the real world
              </Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.error }]}
                onPress={() => setShowARPlacement(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setShowARPlacement(false);
                  setShowPlacementModal(true);
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Start AR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  selectedVenue: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  venueImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  venueDescription: {
    fontSize: 12,
    marginBottom: 5,
  },
  venueLocation: {
    fontSize: 12,
  },
  selectVenueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  selectVenueText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  floorPlanContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  floorPlanImage: {
    width: '100%',
    height: 200,
  },
  floorPlanOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
  },
  floorPlanText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  floorPlanSubtext: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  arPlacementContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
  },
  arPlacementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  arPlacementDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  placementCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  placementImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  placementInfo: {
    flex: 1,
  },
  placementName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  placementDescription: {
    fontSize: 12,
    marginBottom: 5,
  },
  placementDetails: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  placementDetail: {
    fontSize: 12,
    marginRight: 10,
  },
  placementLocation: {
    fontSize: 12,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
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
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  venueList: {
    maxHeight: 300,
  },
  venueOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  venueOptionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  venueOptionInfo: {
    flex: 1,
  },
  venueOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  venueOptionDescription: {
    fontSize: 12,
    marginBottom: 2,
  },
  venueOptionLocation: {
    fontSize: 12,
  },
  formContainer: {
    padding: 20,
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
    borderColor: '#444444',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  collectionChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#444444',
  },
  collectionChipText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    padding: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  arPlacementInfo: {
    alignItems: 'center',
    padding: 20,
  },
});

export default NFTPlacementScreen; 