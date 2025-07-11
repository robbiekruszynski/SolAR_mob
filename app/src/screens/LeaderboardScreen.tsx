import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { leaderboardService, LeaderboardPlayer, LeaderboardStats } from '../services/leaderboard';

interface LeaderboardScreenProps {
  navigation: any;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ navigation }) => {
  const { state } = useApp();
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LeaderboardPlayer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<LeaderboardPlayer | null>(null);

  useEffect(() => {
    loadLeaderboard();
    loadCurrentPlayerStats();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const topPlayers = await leaderboardService.getTopPlayers(15);
      const leaderboardStats = await leaderboardService.getLeaderboardStats();
      setPlayers(topPlayers);
      setStats(leaderboardStats);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  const loadCurrentPlayerStats = async () => {
    if (state.wallet.publicKey) {
      try {
        const playerStats = await leaderboardService.getPlayerStats(
          state.wallet.publicKey.toString()
        );
        setCurrentPlayer(playerStats);
      } catch (error) {
        console.error('Failed to load current player stats:', error);
      }
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);
      try {
        const results = await leaderboardService.searchPlayers(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    await loadCurrentPlayerStats();
    setRefreshing(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return '#FFFFFF';
    }
  };

  const renderPlayerCard = (player: LeaderboardPlayer, index: number) => (
    <TouchableOpacity
      key={player.id}
      style={[
        styles.playerCard,
        player.walletAddress === state.wallet.publicKey?.toString() && styles.currentPlayerHighlight,
      ]}
      onPress={() => Alert.alert(
        player.displayName,
        `Rank: ${player.rank}\nMints: ${player.totalMints}\nBONK Earned: ${player.totalBonkEarned}\nAchievements: ${player.achievements.join(', ')}`
      )}
    >
      <View style={styles.rankContainer}>
        <Text style={[styles.rankText, { color: getRankColor(player.rank) }]}>
          {getRankIcon(player.rank)}
        </Text>
      </View>

      <View style={styles.playerInfo}>
        <View style={styles.playerHeader}>
          <Text style={styles.avatar}>{player.avatar}</Text>
          <Text style={styles.playerName}>{player.displayName}</Text>
          {player.walletAddress === state.wallet.publicKey?.toString() && (
            <Ionicons name="person" size={16} color="#FF6B35" />
          )}
        </View>
        
        <View style={styles.playerStats}>
          <View style={styles.statItem}>
            <Ionicons name="diamond" size={14} color="#FFD700" />
            <Text style={styles.statText}>{player.totalMints} mints</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="wallet" size={14} color="#FF6B35" />
            <Text style={styles.statText}>{player.totalBonkEarned} BONK</Text>
          </View>
        </View>

        {player.achievements.length > 0 && (
          <View style={styles.achievementsContainer}>
            {player.achievements.slice(0, 2).map((achievement, idx) => (
              <View key={idx} style={styles.achievementBadge}>
                <Text style={styles.achievementText}>{achievement}</Text>
              </View>
            ))}
            {player.achievements.length > 2 && (
              <Text style={styles.moreAchievements}>+{player.achievements.length - 2}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Top Treasure Hunters</Text>
      </View>

      {/* Stats */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalPlayers}</Text>
            <Text style={styles.statLabel}>Players</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalMints}</Text>
            <Text style={styles.statLabel}>Total Mints</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalBonkDistributed}</Text>
            <Text style={styles.statLabel}>BONK Distributed</Text>
          </View>
        </View>
      )}

      {/* Current Player Stats */}
      {currentPlayer && (
        <View style={styles.currentPlayerContainer}>
          <Text style={styles.currentPlayerTitle}>Your Stats</Text>
          <View style={styles.currentPlayerCard}>
            <View style={styles.currentPlayerHeader}>
              <Text style={styles.avatar}>{currentPlayer.avatar}</Text>
              <Text style={styles.currentPlayerName}>{currentPlayer.displayName}</Text>
              <Text style={styles.currentPlayerRank}>Rank #{currentPlayer.rank}</Text>
            </View>
            <View style={styles.currentPlayerStats}>
              <Text style={styles.currentPlayerStat}>
                {currentPlayer.totalMints} mints • {currentPlayer.totalBonkEarned} BONK
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#CCCCCC" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search players..."
            placeholderTextColor="#CCCCCC"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#CCCCCC" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results */}
      {searchQuery.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsTitle}>
            Search Results ({searchResults.length})
          </Text>
          {searchResults.map((player, index) => renderPlayerCard(player, index))}
          {searchResults.length === 0 && !isSearching && (
            <Text style={styles.noResults}>No players found</Text>
          )}
        </View>
      )}

      {/* Top Players */}
      {searchQuery.length === 0 && (
        <View style={styles.topPlayersContainer}>
          <Text style={styles.sectionTitle}>Top 15 Players</Text>
          {players.map((player, index) => renderPlayerCard(player, index))}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Updated {stats?.lastUpdated.toLocaleTimeString()}
        </Text>
      </View>
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
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 5,
  },
  currentPlayerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  currentPlayerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  currentPlayerCard: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 12,
  },
  currentPlayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  currentPlayerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
    flex: 1,
  },
  currentPlayerRank: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  currentPlayerStats: {
    marginTop: 5,
  },
  currentPlayerStat: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 15,
  },
  searchResultsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  noResults: {
    color: '#CCCCCC',
    textAlign: 'center',
    padding: 20,
  },
  topPlayersContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  playerCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPlayerHighlight: {
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  rankContainer: {
    marginRight: 15,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatar: {
    fontSize: 20,
    marginRight: 10,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  playerStats: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    fontSize: 12,
    color: '#CCCCCC',
    marginLeft: 5,
  },
  achievementsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 5,
  },
  achievementText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  moreAchievements: {
    fontSize: 10,
    color: '#CCCCCC',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#CCCCCC',
    fontSize: 12,
  },
});

export default LeaderboardScreen; 