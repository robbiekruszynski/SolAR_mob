import { PublicKey } from '@solana/web3.js';

export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  external_url?: string;
  animation_url?: string;
  background_color?: string;
  properties?: {
    files?: Array<{
      type: string;
      uri: string;
    }>;
    category?: string;
    creators?: Array<{
      address: string;
      share: number;
    }>;
  };
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
  max_value?: number;
}

export interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  totalSupply: number;
  mintedCount: number;
  bonkReward: number;
  locations: NFTLocation[];
  metadata: NFTMetadata;
  creator: string;
  createdAt: Date;
  status: 'draft' | 'deployed' | 'active' | 'paused';
}

export interface NFTLocation {
  id: string;
  latitude: number;
  longitude: number;
  radius: number; // meters
  description: string;
  isActive: boolean;
  mintAddress?: PublicKey;
  foundCount: number;
  maxFinds: number;
}

export interface NFTCreatorStats {
  totalCollections: number;
  totalNFTs: number;
  totalBonkDistributed: number;
  activeCollections: number;
  totalFinds: number;
}

export interface NFTCreatorService {
  createCollection(collection: Omit<NFTCollection, 'id' | 'createdAt' | 'mintedCount'>): Promise<NFTCollection>;
  updateCollection(id: string, updates: Partial<NFTCollection>): Promise<NFTCollection>;
  getCollection(id: string): Promise<NFTCollection | null>;
  getUserCollections(creatorAddress: string): Promise<NFTCollection[]>;
  deployCollection(id: string): Promise<boolean>;
  addLocation(collectionId: string, location: Omit<NFTLocation, 'id' | 'foundCount'>): Promise<NFTLocation>;
  updateLocation(collectionId: string, locationId: string, updates: Partial<NFTLocation>): Promise<NFTLocation>;
  removeLocation(collectionId: string, locationId: string): Promise<boolean>;
  uploadImage(imageData: string): Promise<string>;
  getCreatorStats(creatorAddress: string): Promise<NFTCreatorStats>;
  mintNFT(collectionId: string, locationId: string, finderAddress: string): Promise<boolean>;
}

export class MockNFTCreatorService implements NFTCreatorService {
  private collections: NFTCollection[] = [
    {
      id: '1',
      name: 'Golden Treasures',
      symbol: 'GOLD',
      description: 'Rare golden artifacts hidden around the city',
      image: 'https://example.com/golden-treasures.png',
      totalSupply: 50,
      mintedCount: 15,
      bonkReward: 100,
      locations: [
        {
          id: 'loc1',
          latitude: 37.7749,
          longitude: -122.4194,
          radius: 50,
          description: 'Golden coin near the fountain',
          isActive: true,
          foundCount: 8,
          maxFinds: 10,
        },
        {
          id: 'loc2',
          latitude: 37.7849,
          longitude: -122.4094,
          radius: 30,
          description: 'Hidden gem in the park',
          isActive: true,
          foundCount: 7,
          maxFinds: 10,
        },
      ],
      metadata: {
        name: 'Golden Treasures',
        symbol: 'GOLD',
        description: 'Rare golden artifacts hidden around the city',
        image: 'https://example.com/golden-treasures.png',
        attributes: [
          { trait_type: 'Rarity', value: 'Legendary' },
          { trait_type: 'Material', value: 'Gold' },
          { trait_type: 'Age', value: 'Ancient' },
        ],
      },
      creator: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      createdAt: new Date('2024-01-01'),
      status: 'active',
    },
    {
      id: '2',
      name: 'Crypto Artifacts',
      symbol: 'CRYPTO',
      description: 'Digital artifacts from the blockchain era',
      image: 'https://example.com/crypto-artifacts.png',
      totalSupply: 100,
      mintedCount: 25,
      bonkReward: 75,
      locations: [
        {
          id: 'loc3',
          latitude: 37.7649,
          longitude: -122.4294,
          radius: 40,
          description: 'Digital artifact in the tech district',
          isActive: true,
          foundCount: 15,
          maxFinds: 20,
        },
      ],
      metadata: {
        name: 'Crypto Artifacts',
        symbol: 'CRYPTO',
        description: 'Digital artifacts from the blockchain era',
        image: 'https://example.com/crypto-artifacts.png',
        attributes: [
          { trait_type: 'Rarity', value: 'Rare' },
          { trait_type: 'Type', value: 'Digital' },
          { trait_type: 'Era', value: 'Blockchain' },
        ],
      },
      creator: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      createdAt: new Date('2024-01-05'),
      status: 'active',
    },
  ];

  async createCollection(collectionData: Omit<NFTCollection, 'id' | 'createdAt' | 'mintedCount'>): Promise<NFTCollection> {
    const newCollection: NFTCollection = {
      ...collectionData,
      id: Date.now().toString(),
      createdAt: new Date(),
      mintedCount: 0,
    };
    
    this.collections.push(newCollection);
    return newCollection;
  }

  async updateCollection(id: string, updates: Partial<NFTCollection>): Promise<NFTCollection> {
    const index = this.collections.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Collection not found');
    }
    
    this.collections[index] = { ...this.collections[index], ...updates };
    return this.collections[index];
  }

  async getCollection(id: string): Promise<NFTCollection | null> {
    return this.collections.find(c => c.id === id) || null;
  }

  async getUserCollections(creatorAddress: string): Promise<NFTCollection[]> {
    return this.collections.filter(c => c.creator === creatorAddress);
  }

  async deployCollection(id: string): Promise<boolean> {
    const collection = await this.getCollection(id);
    if (!collection) {
      throw new Error('Collection not found');
    }
    
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await this.updateCollection(id, { status: 'deployed' });
    return true;
  }

  async addLocation(collectionId: string, locationData: Omit<NFTLocation, 'id' | 'foundCount'>): Promise<NFTLocation> {
    const collection = await this.getCollection(collectionId);
    if (!collection) {
      throw new Error('Collection not found');
    }
    
    const newLocation: NFTLocation = {
      ...locationData,
      id: `loc_${Date.now()}`,
      foundCount: 0,
    };
    
    collection.locations.push(newLocation);
    return newLocation;
  }

  async updateLocation(collectionId: string, locationId: string, updates: Partial<NFTLocation>): Promise<NFTLocation> {
    const collection = await this.getCollection(collectionId);
    if (!collection) {
      throw new Error('Collection not found');
    }
    
    const locationIndex = collection.locations.findIndex(l => l.id === locationId);
    if (locationIndex === -1) {
      throw new Error('Location not found');
    }
    
    collection.locations[locationIndex] = { ...collection.locations[locationIndex], ...updates };
    return collection.locations[locationIndex];
  }

  async removeLocation(collectionId: string, locationId: string): Promise<boolean> {
    const collection = await this.getCollection(collectionId);
    if (!collection) {
      throw new Error('Collection not found');
    }
    
    const locationIndex = collection.locations.findIndex(l => l.id === locationId);
    if (locationIndex === -1) {
      throw new Error('Location not found');
    }
    
    collection.locations.splice(locationIndex, 1);
    return true;
  }

  async uploadImage(imageData: string): Promise<string> {
    // Simulate image upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `https://example.com/uploaded-images/${Date.now()}.png`;
  }

  async getCreatorStats(creatorAddress: string): Promise<NFTCreatorStats> {
    const userCollections = await this.getUserCollections(creatorAddress);
    
    return {
      totalCollections: userCollections.length,
      totalNFTs: userCollections.reduce((sum, c) => sum + c.totalSupply, 0),
      totalBonkDistributed: userCollections.reduce((sum, c) => sum + (c.mintedCount * c.bonkReward), 0),
      activeCollections: userCollections.filter(c => c.status === 'active').length,
      totalFinds: userCollections.reduce((sum, c) => sum + c.mintedCount, 0),
    };
  }

  async mintNFT(collectionId: string, locationId: string, finderAddress: string): Promise<boolean> {
    const collection = await this.getCollection(collectionId);
    if (!collection) {
      throw new Error('Collection not found');
    }
    
    const location = collection.locations.find(l => l.id === locationId);
    if (!location) {
      throw new Error('Location not found');
    }
    
    if (location.foundCount >= location.maxFinds) {
      throw new Error('Maximum finds reached for this location');
    }
    
    // Simulate minting
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    location.foundCount += 1;
    collection.mintedCount += 1;
    
    return true;
  }
}

// Export singleton instance
export const nftCreatorService = new MockNFTCreatorService(); 