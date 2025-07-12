import { Connection, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js';
import { CONFIG } from './config';

export interface WalletState {
  connected: boolean;
  publicKey: PublicKey | null;
  balance: number;
  bonkBalance: number;
  walletName: string | null;
}

export interface WalletProvider {
  name: string;
  url: string;
  icon: string;
  deepLink: string;
}

export interface MobileWalletService {
  connect(walletName: string): Promise<PublicKey>;
  disconnect(): Promise<void>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  getBalance(): Promise<number>;
  getBonkBalance(): Promise<number>;
  getState(): WalletState;
  getWalletProviders(): WalletProvider[];
  openWalletApp(provider: WalletProvider): Promise<void>;
}

export class RealMobileWalletService implements MobileWalletService {
  private state: WalletState = {
    connected: false,
    publicKey: null,
    balance: 0,
    bonkBalance: 0,
    walletName: null,
  };

  private connection: Connection;
  private walletProviders: WalletProvider[] = [
    {
      name: 'Phantom',
      url: 'https://phantom.app',
      icon: '👻',
      deepLink: 'https://phantom.app/ul/browse/',
    },
    {
      name: 'Solflare',
      url: 'https://solflare.com',
      icon: '🔥',
      deepLink: 'https://solflare.com/ul/browse/',
    },
    {
      name: 'Slope',
      url: 'https://slope.finance',
      icon: '📈',
      deepLink: 'https://slope.finance/ul/browse/',
    },
    {
      name: 'Backpack',
      url: 'https://backpack.app',
      icon: '🎒',
      deepLink: 'https://backpack.app/ul/browse/',
    },
  ];

  constructor() {
    this.connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  }

  getWalletProviders(): WalletProvider[] {
    return this.walletProviders;
  }

  async connect(walletName: string): Promise<PublicKey> {
    try {
      const provider = this.walletProviders.find(p => p.name === walletName);
      if (!provider) {
        throw new Error(`Wallet provider ${walletName} not found`);
      }

      // For mobile, we'll use deep linking to open the wallet app
      await this.openWalletApp(provider);

      // Simulate connection (in real implementation, this would use wallet adapter)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock public key for testing
      const publicKey = new PublicKey(CONFIG.MOCK_WALLET_ADDRESS);
      
      this.state = {
        connected: true,
        publicKey,
        balance: 1.5,
        bonkBalance: 1000,
        walletName,
      };

      // Get real balance from blockchain
      const balance = await this.getBalance();
      const bonkBalance = await this.getBonkBalance();
      
      this.state.balance = balance;
      this.state.bonkBalance = bonkBalance;
      
      console.log(`Connected to ${walletName} wallet:`, publicKey.toString());
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
      walletName: null,
    };
    console.log('Wallet disconnected');
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    if (!this.state.connected || !this.state.publicKey) {
      throw new Error('Wallet not connected');
    }

    // In a real implementation, this would use the wallet adapter to sign
    console.log('Signing transaction:', transaction);
    return transaction;
  }

  async getBalance(): Promise<number> {
    if (!this.state.connected || !this.state.publicKey) {
      return 0;
    }

    try {
      const balance = await this.connection.getBalance(this.state.publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Failed to get balance:', error);
      return this.state.balance; // Return cached balance
    }
  }

  async getBonkBalance(): Promise<number> {
    if (!this.state.connected || !this.state.publicKey) {
      return 0;
    }

    try {
      // BONK token mint address on devnet
      const BONK_MINT = new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
      
      // Get token account info
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        this.state.publicKey,
        { mint: BONK_MINT }
      );

      if (tokenAccounts.value.length > 0) {
        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        return balance || 0;
      }
      
      return 0;
    } catch (error) {
      console.error('Failed to get BONK balance:', error);
      return this.state.bonkBalance; // Return cached balance
    }
  }

  getState(): WalletState {
    return { ...this.state };
  }

  async openWalletApp(provider: WalletProvider): Promise<void> {
    // This would open the wallet app using deep linking
    // For now, we'll simulate the process
    console.log(`Opening ${provider.name} wallet app...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async refreshBalances(): Promise<void> {
    if (this.state.connected) {
      const balance = await this.getBalance();
      const bonkBalance = await this.getBonkBalance();
      
      this.state.balance = balance;
      this.state.bonkBalance = bonkBalance;
    }
  }
}

// Export singleton instance
export const mobileWalletService = new RealMobileWalletService(); 