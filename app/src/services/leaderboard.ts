import { PublicKey } from '@solana/web3.js';

export interface LeaderboardPlayer {
  id: string;
  walletAddress: string;
  displayName: string;
  totalMints: number;
  totalBonkEarned: number;
  lastMintDate: Date;
  rank: number;
  avatar?: string;
  achievements: string[];
}

export interface LeaderboardStats {
  totalPlayers: number;
  totalMints: number;
  totalBonkDistributed: number;
  lastUpdated: Date;
}

export interface LeaderboardService {
  getTopPlayers(limit?: number): Promise<LeaderboardPlayer[]>;
  getPlayerStats(walletAddress: string): Promise<LeaderboardPlayer | null>;
  updatePlayerMint(walletAddress: string, bonkEarned: number): Promise<void>;
  searchPlayers(query: string): Promise<LeaderboardPlayer[]>;
  getLeaderboardStats(): Promise<LeaderboardStats>;
}

export class MockLeaderboardService implements LeaderboardService {
  private players: LeaderboardPlayer[] = [
    {
      id: '1',
      walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      displayName: 'TreasureHunter_01',
      totalMints: 15,
      totalBonkEarned: 1500,
      lastMintDate: new Date('2024-01-15'),
      rank: 1,
      avatar: '🏆',
      achievements: ['First Mint', 'Treasure Master', 'Speed Demon'],
    },
    {
      id: '2',
      walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      displayName: 'CryptoExplorer',
      totalMints: 12,
      totalBonkEarned: 1200,
      lastMintDate: new Date('2024-01-14'),
      rank: 2,
      avatar: '⚡',
      achievements: ['First Mint', 'Treasure Hunter'],
    },
    {
      id: '3',
      walletAddress: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhA5M4gkmTUgQ',
      displayName: 'AR_Adventurer',
      totalMints: 10,
      totalBonkEarned: 1000,
      lastMintDate: new Date('2024-01-13'),
      rank: 3,
      avatar: '🗺️',
      achievements: ['First Mint'],
    },
    {
      id: '4',
      walletAddress: '3XwxHcbyqcd1xkBExFyLwGxE1wH7CkRbc3YzE4WqGjL',
      displayName: 'SolanaSeeker',
      totalMints: 8,
      totalBonkEarned: 800,
      lastMintDate: new Date('2024-01-12'),
      rank: 4,
      avatar: '💎',
      achievements: ['First Mint'],
    },
    {
      id: '5',
      walletAddress: '2XwxHcbyqcd1xkBExFyLwGxE1wH7CkRbc3YzE4WqGjL',
      displayName: 'BonkCollector',
      totalMints: 7,
      totalBonkEarned: 700,
      lastMintDate: new Date('2024-01-11'),
      rank: 5,
      avatar: '🪙',
      achievements: ['First Mint'],
    },
    {
      id: '6',
      walletAddress: '1XwxHcbyqcd1xkBExFyLwGxE1wH7CkRbc3YzE4WqGjL',
      displayName: 'NFT_Hunter',
      totalMints: 6,
      totalBonkEarned: 600,
      lastMintDate: new Date('2024-01-10'),
      rank: 6,
      avatar: '🎯',
      achievements: ['First Mint'],
    },
    {
      id: '7',
      walletAddress: '8XwxHcbyqcd1xkBExFyLwGxE1wH7CkRbc3YzE4WqGjL',
      displayName: 'TreasureMaster',
      totalMints: 5,
      totalBonkEarned: 500,
      lastMintDate: new Date('2024-01-09'),
      rank: 7,
      avatar: '👑',
      achievements: ['First Mint'],
    },
    {
      id: '8',
      walletAddress: '9XwxHcbyqcd1xkBExFyLwGxE1wH7CkRbc3YzE4WqGjL',
      displayName: 'AR_Enthusiast',
      totalMints: 4,
      totalBonkEarned: 400,
      lastMintDate: new Date('2024-01-08'),
      rank: 8,
      avatar: '📱',
      achievements: ['First Mint'],
    },
    {
      id: '9',
      walletAddress: '0XwxHcbyqcd1xkBExFyLwGxE1wH7CkRbc3YzE4WqGjL',
      displayName: 'CryptoNomad',
      totalMints: 3,
      totalBonkEarned: 300,
      lastMintDate: new Date('2024-01-07'),
      rank: 9,
      avatar: '🌍',
      achievements: ['First Mint'],
    },
    {
      id: '10',
      walletAddress: 'AXwxHcbyqcd1xkBExFyLwGxE1wH7CkRbc3YzE4WqGjL',
      displayName: 'SolanaFan',
      totalMints: 2,
      totalBonkEarned: 200,
      lastMintDate: new Date('2024-01-06'),
      rank: 10,
      avatar: '🔗',
      achievements: ['First Mint'],
    },
    {
      id: '11',
      walletAddress: 'BXwxHcbyqcd1xkBExFyLwGxE1wH7CkRbc3YzE4WqGjL',
      displayName: 'BonkLover',
      totalMints: 1,
      totalBonkEarned: 100,
      lastMintDate: new Date('2024-01-05'),
      rank: 11,
      avatar: '🪙',
      achievements: ['First Mint'],
    },
    {
      id: '12',
      walletAddress: 'CXwxHcbyqcd1xkBExFyLwGxE1wH7CkRbc3YzE4WqGjL',
      displayName: 'TreasureNewbie',
      totalMints: 1,
      totalBonkEarned: 50,
      lastMintDate: new Date('2024-01-04'),
      rank: 12,
      avatar: '🆕',
      achievements: ['First Mint'],
    },
    {
      id: '13',
      walletAddress: 'DXwxHcbyqcd1xkBExFyLwGxE1wH7CkRbc3YzE4WqGjL',
      displayName: 'AR_Explorer',
      totalMints: 1,
      totalBonkEarned: 75,
      lastMintDate: new Date('2024-01-03'),
      rank: 13,
      avatar: '🔍',
      achievements: ['First Mint'],
    },
    {
      id: '14',
      walletAddress: 'EXwxHcbyqcd1xkBExFyLwGxE1wH7CkRbc3YzE4WqGjL',
      displayName: 'CryptoCurious',
      totalMints: 1,
      totalBonkEarned: 25,
      lastMintDate: new Date('2024-01-02'),
      rank: 14,
      avatar: '🤔',
      achievements: ['First Mint'],
    },
    {
      id: '15',
      walletAddress: 'FXwxHcbyqcd1xkBExFyLwGxE1wH7CkRbc3YzE4WqGjL',
      displayName: 'SolanaNewcomer',
      totalMints: 1,
      totalBonkEarned: 30,
      lastMintDate: new Date('2024-01-01'),
      rank: 15,
      avatar: '🌟',
      achievements: ['First Mint'],
    },
  ];

  async getTopPlayers(limit: number = 15): Promise<LeaderboardPlayer[]> {
    // Sort by total mints (descending), then by total BONK earned
    const sortedPlayers = [...this.players].sort((a, b) => {
      if (a.totalMints !== b.totalMints) {
        return b.totalMints - a.totalMints;
      }
      return b.totalBonkEarned - a.totalBonkEarned;
    });

    // Update ranks
    sortedPlayers.forEach((player, index) => {
      player.rank = index + 1;
    });

    return sortedPlayers.slice(0, limit);
  }

  async getPlayerStats(walletAddress: string): Promise<LeaderboardPlayer | null> {
    return this.players.find(p => p.walletAddress === walletAddress) || null;
  }

  async updatePlayerMint(walletAddress: string, bonkEarned: number): Promise<void> {
    let player = this.players.find(p => p.walletAddress === walletAddress);
    
    if (player) {
      // Update existing player
      player.totalMints += 1;
      player.totalBonkEarned += bonkEarned;
      player.lastMintDate = new Date();
      
      // Add achievements based on milestones
      if (player.totalMints === 5) {
        player.achievements.push('Treasure Hunter');
      }
      if (player.totalMints === 10) {
        player.achievements.push('Treasure Master');
      }
      if (player.totalMints === 15) {
        player.achievements.push('Speed Demon');
      }
    } else {
      // Create new player
      const newPlayer: LeaderboardPlayer = {
        id: Date.now().toString(),
        walletAddress,
        displayName: `Player_${walletAddress.slice(0, 8)}`,
        totalMints: 1,
        totalBonkEarned: bonkEarned,
        lastMintDate: new Date(),
        rank: 0,
        avatar: '🆕',
        achievements: ['First Mint'],
      };
      this.players.push(newPlayer);
    }

    // Recalculate ranks
    await this.getTopPlayers();
  }

  async searchPlayers(query: string): Promise<LeaderboardPlayer[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.players.filter(player => 
      player.displayName.toLowerCase().includes(lowercaseQuery) ||
      player.walletAddress.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getLeaderboardStats(): Promise<LeaderboardStats> {
    const totalPlayers = this.players.length;
    const totalMints = this.players.reduce((sum, player) => sum + player.totalMints, 0);
    const totalBonkDistributed = this.players.reduce((sum, player) => sum + player.totalBonkEarned, 0);

    return {
      totalPlayers,
      totalMints,
      totalBonkDistributed,
      lastUpdated: new Date(),
    };
  }
}

// Export singleton instance
export const leaderboardService = new MockLeaderboardService(); 