import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MapScreenProps {
  navigation: any;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const mockTreasures = [
    {
      id: '1',
      name: 'Golden Coin',
      distance: '150m',
      bonkReward: 100,
      isFound: false,
    },
    {
      id: '2',
      name: 'Silver Gem',
      distance: '300m',
      bonkReward: 50,
      isFound: false,
    },
    {
      id: '3',
      name: 'Diamond Crown',
      distance: '500m',
      bonkReward: 200,
      isFound: true,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Treasure Map</Text>
        <Text style={styles.subtitle}>Nearby treasures</Text>
      </View>

      <ScrollView style={styles.treasureList}>
        {mockTreasures.map((treasure) => (
          <TouchableOpacity
            key={treasure.id}
            style={[styles.treasureCard, treasure.isFound && styles.foundCard]}
            onPress={() => {
              if (!treasure.isFound) {
                navigation.navigate('Camera');
              }
            }}
          >
            <View style={styles.treasureIcon}>
              <Ionicons 
                name={treasure.isFound ? "checkmark-circle" : "diamond"} 
                size={32} 
                color={treasure.isFound ? "#4CAF50" : "#FFD700"} 
              />
            </View>
            
            <View style={styles.treasureInfo}>
              <Text style={styles.treasureName}>{treasure.name}</Text>
              <Text style={styles.treasureDistance}>{treasure.distance} away</Text>
              <Text style={styles.treasureReward}>{treasure.bonkReward} BONK</Text>
            </View>
            
            <View style={styles.treasureStatus}>
              {treasure.isFound ? (
                <Ionicons name="checkmark" size={24} color="#4CAF50" />
              ) : (
                <Ionicons name="arrow-forward" size={24} color="#FF6B35" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Found</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>200</Text>
          <Text style={styles.statLabel}>BONK Earned</Text>
        </View>
      </View>
    </View>
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
  treasureList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  treasureCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  foundCard: {
    backgroundColor: '#1A2A1A',
    opacity: 0.7,
  },
  treasureIcon: {
    marginRight: 15,
  },
  treasureInfo: {
    flex: 1,
  },
  treasureName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  treasureDistance: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 2,
  },
  treasureReward: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginTop: 2,
  },
  treasureStatus: {
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#2A2A2A',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 2,
  },
});

export default MapScreen; 