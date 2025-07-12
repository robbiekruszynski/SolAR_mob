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
  NFTAttribute 
} from '../services/nftCreator';

interface CollectionDetailScreenProps {
  navigation: any;
  route: any;
}

const CollectionDetailScreen: React.FC<CollectionDetailScreenProps> = ({ navigation, route }) => {
  const { state } = useApp();
  const { collectionId } = route.params;
  const [collection, setCollection] = useState<NFTCollection | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAttributeModal, setShowAttributeModal] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState({
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

  const [attributeForm, setAttributeForm] = useState({
    trait_type: '',
    value: '',
    display_type: '',
  });

  useEffect(() => {
    loadCollection();
  }, [collectionId]);

  const loadCollection = async () => {
    try {
      setLoading(true);
      const collectionData = await nftCreatorService.getCollection(collectionId);
      setCollection(collectionData);
      
      if (collectionData) {
        setEditForm({
          name: collectionData.name,
          symbol: collectionData.symbol,
          description: collectionData.description,
          image: collectionData.image,
          totalSupply: collectionData.totalSupply,
          bonkReward: collectionData.bonkReward,
        });
      }
    } catch (error) {
      console.error('Failed to load collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCollection = async () => {
    if (!collection) return;

    try {
      setLoading(true);
      await nftCreatorService.updateCollection(collectionId, {
        name: editForm.name,
        symbol: editForm.symbol,
        description: editForm.description,
        image: editForm.image,
        totalSupply: editForm.totalSupply,
        bonkReward: editForm.bonkReward,
        metadata: {
          ...collection.metadata,
          name: editForm.name,
          symbol: editForm.symbol,
          description: editForm.description,
          image: editForm.image,
        },
      });
      
      await loadCollection();
      setShowEditModal(false);
      Alert.alert('Success', 'Collection updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update collection');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async () => {
    if (!collection) return;

    try {
      setLoading(true);
      await nftCreatorService.addLocation(collectionId, {
        latitude: locationForm.latitude,
        longitude: locationForm.longitude,
        radius: locationForm.radius,
        description: locationForm.description,
        maxFinds: locationForm.maxFinds,
        isActive: true,
      });

      await loadCollection();
      setShowLocationModal(false);
      resetLocationForm();
      Alert.alert('Success', 'Location added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add location');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttribute = () => {
    if (!collection) return;

    const newAttribute: NFTAttribute = {
      trait_type: attributeForm.trait_type,
      value: attributeForm.value,
      display_type: attributeForm.display_type || undefined,
    };

    const updatedMetadata = {
      ...collection.metadata,
      attributes: [...collection.metadata.attributes, newAttribute],
    };

    nftCreatorService.updateCollection(collectionId, {
      metadata: updatedMetadata,
    }).then(() => {
      loadCollection();
      setShowAttributeModal(false);
      resetAttributeForm();
      Alert.alert('Success', 'Attribute added successfully!');
    }).catch(() => {
      Alert.alert('Error', 'Failed to add attribute');
    });
  };

  const handleToggleLocation = async (locationId: string, isActive: boolean) => {
    try {
      await nftCreatorService.updateLocation(collectionId, locationId, { isActive });
      await loadCollection();
    } catch (error) {
      Alert.alert('Error', 'Failed to update location');
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await nftCreatorService.removeLocation(collectionId, locationId);
              await loadCollection();
              Alert.alert('Success', 'Location deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete location');
            }
          },
        },
      ]
    );
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

  const resetAttributeForm = () => {
    setAttributeForm({
      trait_type: '',
      value: '',
      display_type: '',
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading collection...</Text>
      </View>
    );
  }

  if (!collection) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Collection not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={{ uri: collection.image }} 
          style={styles.collectionImage}
          defaultSource={require('../../assets/icon.png')}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.collectionName}>{collection.name}</Text>
          <Text style={styles.collectionSymbol}>{collection.symbol}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(collection.status) }]}>
            <Text style={styles.statusText}>{collection.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{collection.mintedCount}/{collection.totalSupply}</Text>
          <Text style={styles.statLabel}>Minted</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{collection.locations.length}</Text>
          <Text style={styles.statLabel}>Locations</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{collection.bonkReward}</Text>
          <Text style={styles.statLabel}>BONK Reward</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowEditModal(true)}
        >
          <Ionicons name="create" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Edit Collection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => setShowLocationModal(true)}
        >
          <Ionicons name="location" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Add Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => setShowAttributeModal(true)}
        >
          <Ionicons name="list" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Add Attribute</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{collection.description}</Text>
      </View>

      {/* Attributes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attributes</Text>
        {collection.metadata.attributes.map((attr, index) => (
          <View key={index} style={styles.attributeItem}>
            <Text style={styles.attributeType}>{attr.trait_type}</Text>
            <Text style={styles.attributeValue}>{attr.value}</Text>
          </View>
        ))}
      </View>

      {/* Locations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Locations</Text>
        {collection.locations.map((location) => (
          <View key={location.id} style={styles.locationItem}>
            <View style={styles.locationInfo}>
              <Text style={styles.locationDescription}>{location.description}</Text>
              <Text style={styles.locationCoords}>
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </Text>
              <Text style={styles.locationStats}>
                {location.foundCount}/{location.maxFinds} found • {location.radius}m radius
              </Text>
            </View>
            <View style={styles.locationActions}>
              <Switch
                value={location.isActive}
                onValueChange={(value) => handleToggleLocation(location.id, value)}
                trackColor={{ false: '#666666', true: '#4CAF50' }}
                thumbColor="#FFFFFF"
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteLocation(location.id)}
              >
                <Ionicons name="trash" size={16} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Edit Collection Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Collection</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Collection Name"
                placeholderTextColor="#CCCCCC"
                value={editForm.name}
                onChangeText={(text) => setEditForm({...editForm, name: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Symbol"
                placeholderTextColor="#CCCCCC"
                value={editForm.symbol}
                onChangeText={(text) => setEditForm({...editForm, symbol: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor="#CCCCCC"
                multiline
                value={editForm.description}
                onChangeText={(text) => setEditForm({...editForm, description: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Image URL"
                placeholderTextColor="#CCCCCC"
                value={editForm.image}
                onChangeText={(text) => setEditForm({...editForm, image: text})}
              />
              
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Total Supply</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="100"
                    placeholderTextColor="#CCCCCC"
                    keyboardType="numeric"
                    value={editForm.totalSupply.toString()}
                    onChangeText={(text) => setEditForm({...editForm, totalSupply: parseInt(text) || 0})}
                  />
                </View>
                
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>BONK Reward</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="50"
                    placeholderTextColor="#CCCCCC"
                    keyboardType="numeric"
                    value={editForm.bonkReward.toString()}
                    onChangeText={(text) => setEditForm({...editForm, bonkReward: parseInt(text) || 0})}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.createModalButton]}
                onPress={handleUpdateCollection}
                disabled={loading}
              >
                <Text style={styles.modalButtonText}>
                  {loading ? 'Updating...' : 'Update Collection'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Location Modal */}
      <Modal visible={showLocationModal} animationType="slide" transparent={true}>
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

      {/* Add Attribute Modal */}
      <Modal visible={showAttributeModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Attribute</Text>
              <TouchableOpacity onPress={() => setShowAttributeModal(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Trait Type (e.g., Rarity)"
                placeholderTextColor="#CCCCCC"
                value={attributeForm.trait_type}
                onChangeText={(text) => setAttributeForm({...attributeForm, trait_type: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Value (e.g., Legendary)"
                placeholderTextColor="#CCCCCC"
                value={attributeForm.value}
                onChangeText={(text) => setAttributeForm({...attributeForm, value: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Display Type (optional)"
                placeholderTextColor="#CCCCCC"
                value={attributeForm.display_type}
                onChangeText={(text) => setAttributeForm({...attributeForm, display_type: text})}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAttributeModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.createModalButton]}
                onPress={handleAddAttribute}
              >
                <Text style={styles.modalButtonText}>Add Attribute</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  collectionImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  collectionSymbol: {
    fontSize: 16,
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
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  description: {
    color: '#CCCCCC',
    fontSize: 16,
    lineHeight: 24,
  },
  attributeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  attributeType: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: 'bold',
  },
  attributeValue: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  locationItem: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationCoords: {
    color: '#CCCCCC',
    fontSize: 12,
    marginTop: 2,
  },
  locationStats: {
    color: '#CCCCCC',
    fontSize: 12,
    marginTop: 2,
  },
  locationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 10,
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

export default CollectionDetailScreen; 