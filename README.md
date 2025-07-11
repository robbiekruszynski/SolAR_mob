# SolAR_mob - NFT-Based AR Treasure Hunt

A mobile AR treasure hunt game built for Solana Mobile, where users hunt for AR NFTs hidden in real-world locations and mint them on Solana when found.

## 🎯 Features

- **AR Treasure Hunting**: Use your phone's camera to find hidden AR NFTs in the real world
- **GPS Location Tracking**: Discover treasures based on your real-world location
- **Solana Wallet Integration**: Seamless wallet connection using Solana Mobile Stack
- **NFT Minting**: Mint unique NFTs when you discover treasures
- **BONK Integration**: Earn BONK tokens for finding treasures
- **Cross-Platform**: Works on both iOS and Android

## 🏗️ Tech Stack

- **Frontend**: React Native + Expo
- **AR**: ARKit (iOS) + ARCore (Android) via Expo AR
- **Blockchain**: Solana + Anchor Framework
- **Wallet**: Solana Mobile Stack + AppKit
- **Location**: React Native Location Services
- **UI**: React Native Elements + Custom Components

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
5. **Leaderboard**: Compete with other treasure hunters

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

## 🎯 Hackathon Goals

- [x] Project setup and architecture
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