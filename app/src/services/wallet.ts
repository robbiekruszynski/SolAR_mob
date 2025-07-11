import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { CONFIG } from './config';

export interface WalletState {
  connected: boolean;
  publicKey: PublicKey | null;
  balance: number;
  bonkBalance: number;
}

export interface WalletService {
  connect(): Promise<PublicKey>;
  disconnect(): Promise<void>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  getBalance(): Promise<number>;
  getBonkBalance(): Promise<number>;
  getState(): WalletState;
}

export class MockWalletService implements WalletService {
  private state: WalletState = {
    connected: false,
    publicKey: null,
    balance: 0,
    bonkBalance: 0,
  };

  async connect(): Promise<PublicKey> {
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const publicKey = new PublicKey(CONFIG.MOCK_WALLET_ADDRESS);
      this.state = {
        connected: true,
        publicKey,
        balance: 1.5,
        bonkBalance: 1000,
      };
      
      console.log('Wallet connected:', publicKey.toString());
      return publicKey;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.state = {
      connected: false,
      publicKey: null,
      balance: 0,
      bonkBalance: 0,
    };
    console.log('Wallet disconnected');
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    if (!this.state.connected || !this.state.publicKey) {
      throw new Error('Wallet not connected');
    }

    // For now, we'll simulate transaction signing
    console.log('Signing transaction:', transaction);
    return transaction;
  }

  async getBalance(): Promise<number> {
    if (!this.state.connected) {
      return 0;
    }
    return this.state.balance;
  }

  async getBonkBalance(): Promise<number> {
    if (!this.state.connected) {
      return 0;
    }
    return this.state.bonkBalance;
  }

  getState(): WalletState {
    return { ...this.state };
  }
}

// Export singleton instance
export const walletService = new MockWalletService(); 