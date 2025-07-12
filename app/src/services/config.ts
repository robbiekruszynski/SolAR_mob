import { PublicKey } from '@solana/web3.js';

// Environment configuration
export const CONFIG = {
  // Solana Configuration
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  SOLANA_WS_URL: process.env.SOLANA_WS_URL || 'wss://api.devnet.solana.com',
  SOLANA_NETWORK: process.env.SOLANA_NETWORK || 'devnet',
  
  // Program IDs (These should be replaced with actual program IDs in production)
  TREASURE_HUNT_PROGRAM_ID: new PublicKey(
    process.env.TREASURE_HUNT_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'
  ),
  
  // Token Configuration
  BONK_TOKEN_MINT: new PublicKey(
    process.env.BONK_TOKEN_MINT || 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
  ),
  
  // API Keys (These should be set in .env file for production)
  AR_API_KEY: process.env.AR_API_KEY || '',
  MAPS_API_KEY: process.env.MAPS_API_KEY || '',
  
  // Development Configuration (DO NOT USE IN PRODUCTION)
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

// Security validation
export const validateSecurityConfig = () => {
  const warnings: string[] = [];
  
  // Check for development settings in production
  if (CONFIG.DEBUG_MODE && CONFIG.SOLANA_NETWORK === 'mainnet') {
    warnings.push('DEBUG_MODE should be false in production');
  }
  
  // Check for placeholder API keys
  if (CONFIG.AR_API_KEY === '' || CONFIG.AR_API_KEY === 'your_ar_service_api_key_here') {
    warnings.push('AR_API_KEY should be set for production');
  }
  
  if (CONFIG.MAPS_API_KEY === '' || CONFIG.MAPS_API_KEY === 'your_google_maps_api_key_here') {
    warnings.push('MAPS_API_KEY should be set for production');
  }
  
  // Check for mock wallet in production
  if (CONFIG.SOLANA_NETWORK === 'mainnet' && CONFIG.MOCK_WALLET_ADDRESS) {
    warnings.push('MOCK_WALLET_ADDRESS should not be used in production');
  }
  
  return warnings;
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
  
  // Check for security warnings
  const securityWarnings = validateSecurityConfig();
  if (securityWarnings.length > 0) {
    console.warn('Security warnings:', securityWarnings);
  }
  
  return true;
};

// Get current network config
export const getCurrentNetworkConfig = () => {
  const network = CONFIG.SOLANA_NETWORK as keyof typeof NETWORK_CONFIG;
  return NETWORK_CONFIG[network] || NETWORK_CONFIG.devnet;
}; 