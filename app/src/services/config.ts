import { PublicKey } from '@solana/web3.js';

// Environment configuration
export const CONFIG = {
  // Solana Configuration
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  SOLANA_WS_URL: process.env.SOLANA_WS_URL || 'wss://api.devnet.solana.com',
  SOLANA_NETWORK: process.env.SOLANA_NETWORK || 'devnet',
  
  // Program IDs
  TREASURE_HUNT_PROGRAM_ID: new PublicKey(
    process.env.TREASURE_HUNT_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'
  ),
  
  // Token Configuration
  BONK_TOKEN_MINT: new PublicKey(
    process.env.BONK_TOKEN_MINT || 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
  ),
  
  // API Keys
  AR_API_KEY: process.env.AR_API_KEY || '',
  MAPS_API_KEY: process.env.MAPS_API_KEY || '',
  
  // Development Configuration
  DEBUG_MODE: process.env.DEBUG_MODE === 'true',
  MOCK_WALLET_ADDRESS: process.env.MOCK_WALLET_ADDRESS || '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  
  // App Configuration
  APP_NAME: 'SolAR Mobile',
  APP_VERSION: '1.0.0',
  
  // Feature Flags
  ENABLE_AR: true,
  ENABLE_LOCATION: true,
  ENABLE_WALLET: true,
  ENABLE_BONK: true,
};

// Network-specific configuration
export const NETWORK_CONFIG = {
  devnet: {
    rpcUrl: 'https://api.devnet.solana.com',
    wsUrl: 'wss://api.devnet.solana.com',
    name: 'Devnet',
  },
  testnet: {
    rpcUrl: 'https://api.testnet.solana.com',
    wsUrl: 'wss://api.testnet.solana.com',
    name: 'Testnet',
  },
  mainnet: {
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    wsUrl: 'wss://api.mainnet-beta.solana.com',
    name: 'Mainnet',
  },
  localhost: {
    rpcUrl: 'http://localhost:8899',
    wsUrl: 'ws://localhost:8900',
    name: 'Localhost',
  },
};

// Validation
export const validateConfig = () => {
  const requiredFields = [
    'SOLANA_RPC_URL',
    'TREASURE_HUNT_PROGRAM_ID',
    'BONK_TOKEN_MINT',
  ];
  
  const missingFields = requiredFields.filter(field => !CONFIG[field as keyof typeof CONFIG]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required configuration: ${missingFields.join(', ')}`);
  }
  
  return true;
};

// Get current network config
export const getCurrentNetworkConfig = () => {
  const network = CONFIG.SOLANA_NETWORK as keyof typeof NETWORK_CONFIG;
  return NETWORK_CONFIG[network] || NETWORK_CONFIG.devnet;
}; 