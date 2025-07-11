import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

export interface WalletAdapter {
  connect(): Promise<PublicKey>;
  disconnect(): Promise<void>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
  publicKey: PublicKey | null;
  connected: boolean;
}

export class MobileWalletAdapter implements WalletAdapter {
  public publicKey: PublicKey | null = null;
  public connected: boolean = false;
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async connect(): Promise<PublicKey> {
    try {
      // For now, we'll simulate wallet connection
      // In a real implementation, this would integrate with Solana Mobile Stack
      const mockPublicKey = new PublicKey('11111111111111111111111111111111');
      this.publicKey = mockPublicKey;
      this.connected = true;
      
      console.log('Wallet connected:', mockPublicKey.toString());
      return mockPublicKey;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.publicKey = null;
    this.connected = false;
    console.log('Wallet disconnected');
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    if (!this.connected || !this.publicKey) {
      throw new Error('Wallet not connected');
    }

    // For now, we'll simulate transaction signing
    // In a real implementation, this would use Solana Mobile Stack
    console.log('Signing transaction:', transaction);
    return transaction;
  }

  async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    if (!this.connected || !this.publicKey) {
      throw new Error('Wallet not connected');
    }

    // For now, we'll simulate signing all transactions
    console.log('Signing all transactions:', transactions.length);
    return transactions;
  }
}

export class TreasureHuntClient {
  private connection: Connection;
  private wallet: MobileWalletAdapter;
  private programId: PublicKey;

  constructor(connection: Connection, wallet: MobileWalletAdapter, programId: PublicKey) {
    this.connection = connection;
    this.wallet = wallet;
    this.programId = programId;
  }

  async initializeTreasure(
    treasureName: string,
    treasureSymbol: string,
    treasureUri: string,
    locationLat: number,
    locationLng: number,
    bonkReward: number
  ) {
    if (!this.wallet.connected || !this.wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    // Create instruction to initialize treasure
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true },
        // Add other required accounts here
      ],
      programId: this.programId,
      data: Buffer.from([
        // Instruction discriminator for initialize_treasure
        0, 0, 0, 0, 0, 0, 0, 0,
        // Add other data as needed
      ]),
    });

    const transaction = new Transaction().add(instruction);
    const signedTransaction = await this.wallet.signTransaction(transaction);
    
    const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
    await this.connection.confirmTransaction(signature);
    
    return signature;
  }

  async discoverTreasure(treasureAddress: PublicKey) {
    if (!this.wallet.connected || !this.wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    // Create instruction to discover treasure
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: treasureAddress, isSigner: false, isWritable: true },
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true },
        // Add other required accounts here
      ],
      programId: this.programId,
      data: Buffer.from([
        // Instruction discriminator for discover_treasure
        1, 0, 0, 0, 0, 0, 0, 0,
      ]),
    });

    const transaction = new Transaction().add(instruction);
    const signedTransaction = await this.wallet.signTransaction(transaction);
    
    const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
    await this.connection.confirmTransaction(signature);
    
    return signature;
  }

  async getTreasureInfo(treasureAddress: PublicKey) {
    try {
      const accountInfo = await this.connection.getAccountInfo(treasureAddress);
      if (!accountInfo) {
        throw new Error('Treasure not found');
      }
      
      // Parse treasure data from account info
      // This would need to match the Treasure struct from the smart contract
      return {
        found: false,
        name: 'Unknown Treasure',
        symbol: 'TRSR',
        uri: '',
        location: { lat: 0, lng: 0 },
        bonkReward: 0,
      };
    } catch (error) {
      console.error('Failed to get treasure info:', error);
      throw error;
    }
  }
}

// BONK token integration - use environment variable
export const BONK_TOKEN_MINT = new PublicKey(
  process.env.BONK_TOKEN_MINT || 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
);

export class BonkIntegration {
  private connection: Connection;
  private wallet: MobileWalletAdapter;

  constructor(connection: Connection, wallet: MobileWalletAdapter) {
    this.connection = connection;
    this.wallet = wallet;
  }

  async getBonkBalance(): Promise<number> {
    if (!this.wallet.connected || !this.wallet.publicKey) {
      return 0;
    }

    try {
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        this.wallet.publicKey,
        { mint: BONK_TOKEN_MINT }
      );

      if (tokenAccounts.value.length > 0) {
        return Number(tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount);
      }
      
      return 0;
    } catch (error) {
      console.error('Failed to get BONK balance:', error);
      return 0;
    }
  }

  async transferBonk(to: PublicKey, amount: number): Promise<string> {
    if (!this.wallet.connected || !this.wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    // Create transfer instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: to, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      programId: TOKEN_PROGRAM_ID,
      data: Buffer.from([
        // Transfer instruction
        3,
        // Amount (8 bytes)
        ...new Uint8Array(new BigUint64Array([BigInt(amount)]).buffer),
      ]),
    });

    const transaction = new Transaction().add(instruction);
    const signedTransaction = await this.wallet.signTransaction(transaction);
    
    const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
    await this.connection.confirmTransaction(signature);
    
    return signature;
  }
} 