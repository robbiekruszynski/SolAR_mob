import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { 
  WalletAdapterNetwork,
  WalletError,
  WalletNotConnectedError,
  WalletNotReadyError,
} from '@solana/wallet-adapter-base';
// Temporarily disabled wallet adapters to fix module resolution issues
// import {
//   PhantomWalletAdapter,
//   SolflareWalletAdapter,
//   SlopeWalletAdapter,
// } from '@solana/wallet-adapter-wallets';

export interface WalletProvider {
  name: string;
  url: string;
  icon: string;
  adapter: any;
}

export interface WalletConnection {
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  select: (walletName: string) => void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTransaction: (transaction: any) => Promise<string>;
  signTransaction: (transaction: any) => Promise<any>;
  signAllTransactions: (transactions: any[]) => Promise<any[]>;
}

export interface SolanaWalletService {
  getConnection(): Connection;
  getWalletProviders(): WalletProvider[];
  connectWallet(walletName: string): Promise<boolean>;
  disconnectWallet(): Promise<void>;
  getBalance(publicKey: PublicKey): Promise<number>;
  getBonkBalance(publicKey: PublicKey): Promise<number>;
  isWalletConnected(): boolean;
  getConnectedWallet(): WalletProvider | null;
  getPublicKey(): PublicKey | null;
}

export class RealSolanaWalletService implements SolanaWalletService {
  private connection: Connection;
  private walletProviders: WalletProvider[];
  private currentWallet: WalletProvider | null = null;
  private walletAdapter: any = null;
  private publicKey: PublicKey | null = null;
  private connected: boolean = false;

  constructor() {
    // Use devnet for development
    this.connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Initialize wallet providers (temporarily disabled)
    this.walletProviders = [
      // {
      //   name: 'Phantom',
      //   url: 'https://phantom.app',
      //   icon: '👻',
      //   adapter: new PhantomWalletAdapter(),
      // },
      // {
      //   name: 'Solflare',
      //   url: 'https://solflare.com',
      //   icon: '🔥',
      //   adapter: new SolflareWalletAdapter(),
      // },
      // {
      //   name: 'Slope',
      //   url: 'https://slope.finance',
      //   icon: '📈',
      //   adapter: new SlopeWalletAdapter(),
      // },
    ];
  }

  getConnection(): Connection {
    return this.connection;
  }

  getWalletProviders(): WalletProvider[] {
    return this.walletProviders;
  }

  async connectWallet(walletName: string): Promise<boolean> {
    try {
      const provider = this.walletProviders.find(p => p.name === walletName);
      if (!provider) {
        throw new Error(`Wallet provider ${walletName} not found`);
      }

      // Check if wallet is available
      if (!provider.adapter.ready) {
        throw new Error(`${walletName} wallet is not available. Please install the extension.`);
      }

      this.currentWallet = provider;
      this.walletAdapter = provider.adapter;

      // Connect to wallet
      await this.walletAdapter.connect();
      
      this.publicKey = this.walletAdapter.publicKey;
      this.connected = true;

      console.log(`Connected to ${walletName} wallet:`, this.publicKey?.toString());
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async disconnectWallet(): Promise<void> {
    try {
      if (this.walletAdapter) {
        await this.walletAdapter.disconnect();
      }
      
      this.currentWallet = null;
      this.walletAdapter = null;
      this.publicKey = null;
      this.connected = false;
      
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  }

  async getBalance(publicKey: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  async getBonkBalance(publicKey: PublicKey): Promise<number> {
    try {
      // BONK token mint address on devnet
      const BONK_MINT = new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
      
      // Get token account info
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        publicKey,
        { mint: BONK_MINT }
      );

      if (tokenAccounts.value.length > 0) {
        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        return balance || 0;
      }
      
      return 0;
    } catch (error) {
      console.error('Failed to get BONK balance:', error);
      return 0;
    }
  }

  isWalletConnected(): boolean {
    return this.connected && this.publicKey !== null;
  }

  getConnectedWallet(): WalletProvider | null {
    return this.currentWallet;
  }

  getPublicKey(): PublicKey | null {
    return this.publicKey;
  }

  async sendTransaction(transaction: any): Promise<string> {
    if (!this.walletAdapter || !this.isWalletConnected()) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await this.walletAdapter.sendTransaction(transaction, this.connection);
      return signature;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  async signTransaction(transaction: any): Promise<any> {
    if (!this.walletAdapter || !this.isWalletConnected()) {
      throw new Error('Wallet not connected');
    }

    try {
      const signedTransaction = await this.walletAdapter.signTransaction(transaction);
      return signedTransaction;
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw error;
    }
  }

  async signAllTransactions(transactions: any[]): Promise<any[]> {
    if (!this.walletAdapter || !this.isWalletConnected()) {
      throw new Error('Wallet not connected');
    }

    try {
      const signedTransactions = await this.walletAdapter.signAllTransactions(transactions);
      return signedTransactions;
    } catch (error) {
      console.error('Failed to sign transactions:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const solanaWalletService = new RealSolanaWalletService(); 