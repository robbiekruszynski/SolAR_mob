import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { 
  nftCreatorService, 
  NFTCollection, 
  NFTLocation, 
  NFTMetadata,
  NFTAttribute,
  NFTCreatorStats 
} from '../services/nftCreator';

interface NFTCreatorScreenProps {
  navigation: any;
}

const NFTCreatorScreen: React.FC<NFTCreatorScreenProps> = ({ navigation }) => {
  const { state } = useApp();
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [stats, setStats] = useState<NFTCreatorStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<NFTCollection | null>(null);

  // Form states
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    symbol: '',
    description: '',
    image: '',
    totalSupply: 100,
    bonkReward: 50,
  });

  const [locationForm, setLocationForm] = useState({
    latitude: 0,
    longitude: 0,
    radius: 50,
    description: '',
    maxFinds: 10,
  });

  const [metadataForm, setMetadataForm] = useState<NFTMetadata>({
    name: '',
    symbol: '',
    description: '',
    image: '',
    attributes: [],
  });

  useEffect(() => {
    loadCreatorData();
  }, []);

  const loadCreatorData = async () => {
    if (!state.wallet.publicKey) return;
    
    setLoading(true);
    try {
      const userCollections = await nftCreatorService.getUserCollections(
        state.wallet.publicKey.toString()
      );
      const creatorStats = await nftCreatorService.getCreatorStats(
        state.wallet.publicKey.toString()
      );
      
      setCollections(userCollections);
      setStats(creatorStats);
    } catch (error) {
      console.error('Failed to load creator data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async () => {
    if (!state.wallet.publicKey) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      
      const newCollection = await nftCreatorService.createCollection({
        name: collectionForm.name,
        symbol: collectionForm.symbol,
        description: collectionForm.description,
        image: collectionForm.image,
        totalSupply: collectionForm.totalSupply,
        bonkReward: collectionForm.bonkReward,
        locations: [],
        metadata: {
          name: collectionForm.name,
          symbol: collectionForm.symbol,
          description: collectionForm.description,
          image: collectionForm.image,
          attributes: [],
        },
        creator: state.wallet.publicKey.toString(),
        status: 'draft',
      });

      setCollections([...collections, newCollection]);
      setShowCreateModal(false);
      resetCollectionForm();
      
      Alert.alert('Success', 'Collection created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create collection');
    } finally {
      setLoading(false);
    }
  };

  const handleDeployCollection = async (collectionId: string) => {
    try {
      setLoading(true);
      await nftCreatorService.deployCollection(collectionId);
      await loadCreatorData();
      Alert.alert('Success', 'Collection deployed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to deploy collection');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async () => {
    if (!selectedCollection) return;

    try {
      setLoading(true);
      
      const newLocation = await nftCreatorService.addLocation(
        selectedCollection.id,
        {
          latitude: locationForm.latitude,
          longitude: locationForm.longitude,
          radius: locationForm.radius,
          description: locationForm.description,
          maxFinds: locationForm.maxFinds,
          isActive: true,
        }
      );

      await loadCreatorData();
      setShowLocationModal(false);
      resetLocationForm();
      
      Alert.alert('Success', 'Location added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add location');
    } finally {
      setLoading(false);
    }
  };

  const resetCollectionForm = () => {
    setCollectionForm({
      name: '',
      symbol: '',
      description: '',
      image: '',
      totalSupply: 100,
      bonkReward: 50,
    });
  };

  const resetLocationForm = () => {
    setLocationForm({
      latitude: 0,
      longitude: 0,
      radius: 50,
      description: '',
      maxFinds: 10,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'deployed': return '#2196F3';
      case 'draft': return '#FF9800';
      case 'paused': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const renderCollectionCard = (collection: NFTCollection) => (
    <TouchableOpacity
      key={collection.id}
      style={styles.collectionCard}
      onPress={() => setSelectedCollection(collection)}
    >
      <View style={styles.collectionHeader}>
        <Image
          source={{ uri: collection.image }}
          style={styles.collectionImage}
          defaultSource={require('../../assets/icon.png')}
        />
        <View style={styles.collectionInfo}>
          <Text style={styles.collectionName}>{collection.name}</Text>
          <Text style={styles.collectionSymbol}>{collection.symbol}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(collection.status) }]}>
            <Text style={styles.statusText}>{collection.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.collectionStats}>
        <View style={styles.statItem}>
          <Ionicons name="layers" size={16} color="#FF6B35" />
          <Text style={styles.statText}>{collection.mintedCount}/{collection.totalSupply}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="location" size={16} color="#FF6B35" />
          <Text style={styles.statText}>{collection.locations.length} locations</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="wallet" size={16} color="#FF6B35" />
          <Text style={styles.statText}>{collection.bonkReward} BONK</Text>
        </View>
      </View>

      <View style={styles.collectionActions}>
        {collection.status === 'draft' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeployCollection(collection.id)}
          >
            <Ionicons name="rocket" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Deploy</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => setSelectedCollection(collection)}
        >
          <Ionicons name="settings" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Manage</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>NFT Creator Dashboard</Text>
        <Text style={styles.subtitle}>Create and manage your AR NFT collections</Text>
      </View>

      {/* Stats */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="layers" size={24} color="#FF6B35" />
            <Text style={styles.statNumber}>{stats.totalCollections}</Text>
            <Text style={styles.statLabel}>Collections</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="diamond" size={24} color="#FFD700" />
            <Text style={styles.statNumber}>{stats.totalNFTs}</Text>
            <Text style={styles.statLabel}>Total NFTs</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="wallet" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats.totalBonkDistributed}</Text>
            <Text style={styles.statLabel}>BONK Distributed</Text>
          </View>
        </View>
      )}

      {/* Create Collection Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.createButtonText}>Create New Collection</Text>
      </TouchableOpacity>

      {/* Collections List */}
      <View style={styles.collectionsContainer}>
        <Text style={styles.sectionTitle}>Your Collections</Text>
        {collections.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="layers-outline" size={48} color="#CCCCCC" />
            <Text style={styles.emptyText}>No collections yet</Text>
            <Text style={styles.emptySubtext}>Create your first AR NFT collection</Text>
          </View>
        ) : (
          collections.map(renderCollectionCard)
        )}
      </View>

      {/* Create Collection Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Collection</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Collection Name"
                placeholderTextColor="#CCCCCC"
                value={collectionForm.name}
                onChangeText={(text) => setCollectionForm({...collectionForm, name: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Symbol (e.g., GOLD)"
                placeholderTextColor="#CCCCCC"
                value={collectionForm.symbol}
                onChangeText={(text) => setCollectionForm({...collectionForm, symbol: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor="#CCCCCC"
                multiline
                value={collectionForm.description}
                onChangeText={(text) => setCollectionForm({...collectionForm, description: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Image URL"
                placeholderTextColor="#CCCCCC"
                value={collectionForm.image}
                onChangeText={(text) => setCollectionForm({...collectionForm, image: text})}
              />
              
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Total Supply</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="100"
                    placeholderTextColor="#CCCCCC"
                    keyboardType="numeric"
                    value={collectionForm.totalSupply.toString()}
                    onChangeText={(text) => setCollectionForm({...collectionForm, totalSupply: parseInt(text) || 0})}
                  />
                </View>
                
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>BONK Reward</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="50"
                    placeholderTextColor="#CCCCCC"
                    keyboardType="numeric"
                    value={collectionForm.bonkReward.toString()}
                    onChangeText={(text) => setCollectionForm({...collectionForm, bonkReward: parseInt(text) || 0})}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.createModalButton]}
                onPress={handleCreateCollection}
                disabled={loading}
              >
                <Text style={styles.modalButtonText}>
                  {loading ? 'Creating...' : 'Create Collection'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Location Modal */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Latitude</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="37.7749"
                    placeholderTextColor="#CCCCCC"
                    keyboardType="numeric"
                    value={locationForm.latitude.toString()}
                    onChangeText={(text) => setLocationForm({...locationForm, latitude: parseFloat(text) || 0})}
                  />
                </View>
                
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Longitude</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="-122.4194"
                    placeholderTextColor="#CCCCCC"
                    keyboardType="numeric"
                    value={locationForm.longitude.toString()}
                    onChangeText={(text) => setLocationForm({...locationForm, longitude: parseFloat(text) || 0})}
                  />
                </View>
              </View>
              
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Radius (meters)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="50"
                    placeholderTextColor="#CCCCCC"
                    keyboardType="numeric"
                    value={locationForm.radius.toString()}
                    onChangeText={(text) => setLocationForm({...locationForm, radius: parseInt(text) || 0})}
                  />
                </View>
                
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Max Finds</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="10"
                    placeholderTextColor="#CCCCCC"
                    keyboardType="numeric"
                    value={locationForm.maxFinds.toString()}
                    onChangeText={(text) => setLocationForm({...locationForm, maxFinds: parseInt(text) || 0})}
                  />
                </View>
              </View>
              
              <TextInput
                style={styles.input}
                placeholder="Location Description"
                placeholderTextColor="#CCCCCC"
                multiline
                value={locationForm.description}
                onChangeText={(text) => setLocationForm({...locationForm, description: text})}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLocationModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.createModalButton]}
                onPress={handleAddLocation}
                disabled={loading}
              >
                <Text style={styles.modalButtonText}>
                  {loading ? 'Adding...' : 'Add Location'}
                </Text>
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
    backgroundColor: '#1A1A1A',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 4,
  },
  createButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  collectionsContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  collectionCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  collectionHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  collectionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  collectionSymbol: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  collectionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#CCCCCC',
    marginLeft: 5,
  },
  collectionActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#CCCCCC',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalBody: {
    padding: 20,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 15,
    color: '#FFFFFF',
    marginBottom: 15,
    fontSize: 16,
  },
  inputLabel: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#444444',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#666666',
  },
  createModalButton: {
    backgroundColor: '#FF6B35',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NFTCreatorScreen; 