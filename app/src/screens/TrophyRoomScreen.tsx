import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

interface CollectedNFT {
  id: string;
  name: string;
  description: string;
  image: string;
  collection: string;
  rarity: string;
  mintDate: string;
  mintPrice: number;
  bonkEarned: number;
  attributes: Array<{ trait_type: string; value: string }>;
}

const TrophyRoomScreen: React.FC = () => {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  // Mock collected NFTs
  const collectedNFTs: CollectedNFT[] = [
    {
      id: '1',
      name: 'Golden Solana Coin',
      description: 'A rare golden coin from the Solana blockchain',
      image: 'https://via.placeholder.com/200x200/FF6B35/FFFFFF?text=GSC',
      collection: 'Solana Legends',
      rarity: 'Legendary',
      mintDate: '2024-01-15',
      mintPrice: 0.1,
      bonkEarned: 100,
      attributes: [
        { trait_type: 'Rarity', value: 'Legendary' },
        { trait_type: 'Type', value: 'Coin' },
        { trait_type: 'Material', value: 'Gold' },
      ],
    },
    {
      id: '2',
      name: 'BONK Warrior #001',
      description: 'A fierce BONK warrior ready for battle',
      image: 'https://via.placeholder.com/200x200/FFD700/000000?text=BW1',
      collection: 'BONK Warriors',
      rarity: 'Epic',
      mintDate: '2024-01-10',
      mintPrice: 0.05,
      bonkEarned: 50,
      attributes: [
        { trait_type: 'Rarity', value: 'Epic' },
        { trait_type: 'Class', value: 'Warrior' },
        { trait_type: 'Power', value: '85' },
      ],
    },
    {
      id: '3',
      name: 'Crypto Treasure Chest',
      description: 'A mysterious chest filled with crypto treasures',
      image: 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=CTC',
      collection: 'Crypto Treasures',
      rarity: 'Rare',
      mintDate: '2024-01-08',
      mintPrice: 0.08,
      bonkEarned: 75,
      attributes: [
        { trait_type: 'Rarity', value: 'Rare' },
        { trait_type: 'Type', value: 'Chest' },
        { trait_type: 'Contents', value: 'Mystery' },
      ],
    },
  ];

  const filters = [
    { key: 'all', label: 'All NFTs' },
    { key: 'legendary', label: 'Legendary' },
    { key: 'epic', label: 'Epic' },
    { key: 'rare', label: 'Rare' },
    { key: 'common', label: 'Common' },
  ];

  const sortOptions = [
    { key: 'date', label: 'Date' },
    { key: 'name', label: 'Name' },
    { key: 'rarity', label: 'Rarity' },
    { key: 'price', label: 'Price' },
  ];

  const filteredNFTs = collectedNFTs
    .filter((nft) => {
      const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           nft.collection.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || 
                           nft.rarity.toLowerCase() === selectedFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          return getRarityValue(b.rarity) - getRarityValue(a.rarity);
        case 'price':
          return b.mintPrice - a.mintPrice;
        default:
          return new Date(b.mintDate).getTime() - new Date(a.mintDate).getTime();
      }
    });

  const getRarityValue = (rarity: string): number => {
    const rarityValues = { 'Legendary': 4, 'Epic': 3, 'Rare': 2, 'Common': 1 };
    return rarityValues[rarity as keyof typeof rarityValues] || 0;
  };

  const getRarityColor = (rarity: string): string => {
    const rarityColors = {
      'Legendary': '#FFD700',
      'Epic': '#FF6B35',
      'Rare': '#4CAF50',
      'Common': '#CCCCCC',
    };
    return rarityColors[rarity as keyof typeof rarityColors] || '#CCCCCC';
  };

  const handleNFTPress = (nft: CollectedNFT) => {
    Alert.alert(
      nft.name,
      `Collection: ${nft.collection}\nRarity: ${nft.rarity}\nMint Date: ${nft.mintDate}\nMint Price: ${nft.mintPrice} SOL\nBONK Earned: ${nft.bonkEarned} BONK`,
      [
        { text: 'View Details', onPress: () => {/* Navigate to NFT details */} },
        { text: 'Share', onPress: () => {/* Share NFT */} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const totalValue = collectedNFTs.reduce((sum, nft) => sum + nft.mintPrice, 0);
  const totalBonkEarned = collectedNFTs.reduce((sum, nft) => sum + nft.bonkEarned, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trophy Room</Text>
        <Text style={styles.subtitle}>Your collected NFTs</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="diamond" size={24} color="#FFD700" />
          <Text style={styles.statNumber}>{collectedNFTs.length}</Text>
          <Text style={styles.statLabel}>Total NFTs</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="logo-bitcoin" size={24} color="#FF6B35" />
          <Text style={styles.statNumber}>{totalValue.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Value</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="wallet" size={24} color="#FFD700" />
          <Text style={styles.statNumber}>{totalBonkEarned}</Text>
          <Text style={styles.statLabel}>BONK Earned</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#CCCCCC" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search NFTs..."
          placeholderTextColor="#CCCCCC"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedFilter === filter.key && styles.selectedFilter
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === filter.key && styles.selectedFilterText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortButton,
                sortBy === option.key && styles.selectedSort
              ]}
              onPress={() => setSortBy(option.key)}
            >
              <Text style={[
                styles.sortButtonText,
                sortBy === option.key && styles.selectedSortText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* NFTs Grid */}
      <FlatList
        data={filteredNFTs}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.nftCard}
            onPress={() => handleNFTPress(item)}
          >
            <Image source={{ uri: item.image }} style={styles.nftImage} />
            <View style={styles.nftInfo}>
              <Text style={styles.nftName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.nftCollection} numberOfLines={1}>
                {item.collection}
              </Text>
              <View style={styles.nftRarityContainer}>
                <View style={[
                  styles.nftRarityBadge,
                  { backgroundColor: getRarityColor(item.rarity) }
                ]}>
                  <Text style={styles.nftRarityText}>{item.rarity}</Text>
                </View>
              </View>
              <View style={styles.nftStats}>
                <Text style={styles.nftPrice}>{item.mintPrice} SOL</Text>
                <Text style={styles.nftBonk}>+{item.bonkEarned} BONK</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.nftsGrid}
        showsVerticalScrollIndicator={false}
      />

      {filteredNFTs.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="diamond-outline" size={64} color="#666666" />
          <Text style={styles.emptyStateTitle}>No NFTs Found</Text>
          <Text style={styles.emptyStateSubtitle}>
            Start exploring for NFTs to build your collection!
          </Text>
        </View>
      )}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedFilter: {
    backgroundColor: '#FF6B35',
  },
  filterButtonText: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  selectedFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sortLabel: {
    color: '#CCCCCC',
    fontSize: 14,
    marginRight: 10,
  },
  sortButton: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  selectedSort: {
    backgroundColor: '#FF6B35',
  },
  sortButtonText: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  selectedSortText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  nftsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nftCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    margin: 5,
    flex: 1,
    maxWidth: '48%',
  },
  nftImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  nftInfo: {
    padding: 10,
  },
  nftName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  nftCollection: {
    fontSize: 12,
    color: '#CCCCCC',
    marginBottom: 5,
  },
  nftRarityContainer: {
    marginBottom: 5,
  },
  nftRarityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  nftRarityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  nftStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nftPrice: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  nftBonk: {
    fontSize: 12,
    color: '#FF6B35',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
});

export default TrophyRoomScreen; 