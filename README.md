# SolAR_mob - NFT-Based AR Treasure Hunt

A mobile AR treasure hunt game built for Solana Mobile, where users hunt for AR NFTs hidden in real-world locations and mint them on Solana when found.

## 🎯 Features

- **AR Treasure Hunting**: Use your phone's camera to find hidden AR NFTs in the real world
- **GPS Location Tracking**: Discover treasures based on your real-world location
- **Solana Wallet Integration**: Seamless wallet connection using Solana Mobile Stack
- **NFT Minting**: Mint unique NFTs when you discover treasures
- **BONK Integration**: Earn BONK tokens for finding treasures
- **Leaderboard System**: Compete with other players and track your progress
- **Cross-Platform**: Works on both iOS and Android

## 🏗️ Tech Stack

- **Frontend**: React Native + Expo
- **AR**: ARKit (iOS) + ARCore (Android) via Expo AR
- **Blockchain**: Solana + Anchor Framework
- **Wallet**: Solana Mobile Stack + AppKit
- **Location**: React Native Location Services
- **UI**: React Native Elements + Custom Components

## 🔐 Security & Environment Variables

### Important Security Notes

This project contains sensitive configuration that should be kept private:

- **API Keys**: Google Maps API, AR service API keys
- **Program IDs**: Solana program addresses (when deploying to mainnet)
- **RPC URLs**: Custom Solana RPC endpoints
- **Development Keys**: Mock wallet addresses (development only)

### Environment Variables

Create a `.env` file in the `app/` directory with the following variables:

```bash
# Solana Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_WS_URL=wss://api.devnet.solana.com
SOLANA_NETWORK=devnet

# Program IDs (Replace with actual program IDs when deploying)
TREASURE_HUNT_PROGRAM_ID=your_program_id_here
BONK_TOKEN_MINT=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263

# Mock Wallet (for development only - DO NOT USE IN PRODUCTION)
MOCK_WALLET_ADDRESS=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU

# API Keys (Add your actual API keys here)
MAPS_API_KEY=your_google_maps_api_key_here
AR_API_KEY=your_ar_service_api_key_here

# Development Configuration
DEBUG_MODE=true
```

### Security Checklist

Before sharing your repository publicly:

- [ ] Ensure `.env` file is in `.gitignore`
- [ ] Replace placeholder API keys with actual keys
- [ ] Set `DEBUG_MODE=false` for production
- [ ] Remove mock wallet addresses for mainnet
- [ ] Use proper program IDs for your deployed contracts
- [ ] Review all hardcoded values in `config.ts`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Solana CLI
- Anchor Framework
- Expo CLI
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd SolAR_mob
```

2. **Setup environment variables**
```bash
cd app
cp env.example .env
# Edit .env with your configuration
```

3. **Install dependencies**
```bash
cd app && npm install
cd ../mobile-adapter && npm install
```

4. **Setup Solana development environment**
```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Setup local validator
solana config set --url localhost
```

5. **Start the development server**
```bash
cd app && npm start
```

6. **Run on device**
```bash
# For iOS
npm run ios

# For Android
npm run android
```

## 📱 Mobile Features

- **Camera Integration**: Real-time AR overlay for treasure hunting
- **GPS Location**: Location-based treasure discovery
- **Wallet Connection**: One-tap Solana wallet integration
- **Offline Support**: Basic functionality without internet
- **Push Notifications**: Treasure discovery alerts

## 🎮 Game Mechanics

1. **Treasure Discovery**: Use AR to scan real-world locations
2. **Location Verification**: GPS confirms you're at the right spot
3. **NFT Minting**: Mint unique NFTs when treasures are found
4. **BONK Rewards**: Earn BONK tokens for each discovery
5. **Leaderboard**: Compete with other treasure hunters and track rankings
6. **Player Search**: Search for specific players in the leaderboard
7. **Achievements**: Unlock achievements based on your treasure hunting progress

## 🛠️ Development

### Project Structure
```
SolAR_mob/
├── app/                 # React Native app
├── contracts/           # Solana smart contracts
├── mobile-adapter/      # Solana Mobile Stack integration
├── docs/               # Documentation
└── assets/             # Images, sounds, 3D models
```

### Key Components
- **AR Scanner**: Camera-based treasure detection
- **Wallet Manager**: Solana wallet integration
- **Location Service**: GPS-based treasure tracking
- **NFT Minter**: Smart contract interaction
- **BONK Integration**: Token rewards system
- **Leaderboard System**: Player rankings and statistics
- **Search Functionality**: Find specific players

## 🎯 Hackathon Goals

- [x] Project setup and architecture
- [x] Leaderboard system with player rankings
- [x] Player search functionality
- [x] Achievement system
- [ ] AR camera integration
- [ ] GPS location services
- [ ] Solana wallet connection
- [ ] NFT minting smart contract
- [ ] BONK integration
- [ ] Mobile-optimized UI/UX
- [ ] Cross-platform testing
- [ ] Demo video and documentation

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

This is a hackathon project. Feel free to fork and build upon it!

---

**Built for Solana Mobile Hackathon 2025** 🚀