# SolAR Mobile Setup Guide

This guide will help you set up and run the SolAR Mobile treasure hunt application.

## Prerequisites

### Required Software
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Solana CLI
- Anchor Framework
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Solana Development Environment

1. **Install Solana CLI**
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

2. **Install Anchor Framework**
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
```

3. **Setup Solana configuration**
```bash
solana config set --url localhost
```

## Project Structure

```
SolAR_mob/
├── app/                    # React Native Expo app
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── components/    # Reusable components
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript definitions
│   └── package.json
├── contracts/             # Solana smart contracts
│   ├── src/
│   │   └── lib.rs        # Main contract
│   ├── Cargo.toml
│   └── Anchor.toml
├── mobile-adapter/        # Solana Mobile integration
│   ├── index.ts
│   └── package.json
├── assets/               # Static assets
│   ├── 3d-models/       # AR 3D models
│   ├── images/          # App images
│   └── sounds/          # Audio files
└── docs/                # Documentation
```

## Installation

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd SolAR_mob
```

### 2. Install App Dependencies

```bash
cd app
npm install
```

### 3. Install Mobile Adapter Dependencies

```bash
cd ../mobile-adapter
npm install
```

### 4. Build Smart Contracts

```bash
cd ../contracts
anchor build
```

## Running the Application

### Development Mode

1. **Start the Expo development server**
```bash
cd app
npm start
```

2. **Run on device/simulator**
```bash
# For iOS
npm run ios

# For Android
npm run android

# For web (development)
npm run web
```

### Production Build

1. **Build for Android**
```bash
cd app
eas build --platform android
```

2. **Build for iOS**
```bash
cd app
eas build --platform ios
```

## Smart Contract Deployment

### Local Development

1. **Start local validator**
```bash
solana-test-validator
```

2. **Deploy contracts**
```bash
cd contracts
anchor deploy
```

3. **Update program ID**
Update the `declare_id!()` in `contracts/src/lib.rs` with your deployed program ID.

### Mainnet/Devnet

1. **Switch to devnet**
```bash
solana config set --url devnet
```

2. **Deploy contracts**
```bash
cd contracts
anchor deploy --provider.cluster devnet
```

## Mobile Wallet Integration

The app uses a custom mobile wallet adapter for Solana integration. The adapter is located in `mobile-adapter/` and provides:

- Wallet connection
- Transaction signing
- BONK token integration
- NFT minting

### Integration Steps

1. **Import the adapter**
```typescript
import { MobileWalletAdapter, TreasureHuntClient } from '../mobile-adapter';
```

2. **Initialize connection**
```typescript
const connection = new Connection('https://api.devnet.solana.com');
const wallet = new MobileWalletAdapter(connection);
```

3. **Connect wallet**
```typescript
const publicKey = await wallet.connect();
```

## AR Functionality

The AR scanner uses Expo Camera and can be extended with:

- ARKit (iOS)
- ARCore (Android)
- Expo Three.js for 3D rendering

### Camera Permissions

The app requests camera permissions for AR scanning. Add to `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow SolAR to access your camera for treasure hunting."
        }
      ]
    ]
  }
}
```

## Testing

### Unit Tests

```bash
cd app
npm test
```

### Smart Contract Tests

```bash
cd contracts
anchor test
```

### Integration Tests

```bash
cd app
npm run test:integration
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
```bash
cd app
npx expo start --clear
```

2. **Solana connection issues**
```bash
solana config get
solana config set --url devnet
```

3. **Anchor build issues**
```bash
cd contracts
anchor clean
anchor build
```

### Performance Optimization

1. **Enable Hermes engine**
Add to `app.json`:
```json
{
  "expo": {
    "jsEngine": "hermes"
  }
}
```

2. **Optimize bundle size**
```bash
cd app
npx expo export
```

## Deployment

### App Store Deployment

1. **Configure EAS**
```bash
cd app
eas build:configure
```

2. **Build for production**
```bash
eas build --platform all --profile production
```

3. **Submit to stores**
```bash
eas submit --platform ios
eas submit --platform android
```

### Smart Contract Deployment

1. **Deploy to mainnet**
```bash
cd contracts
anchor deploy --provider.cluster mainnet
```

2. **Verify on Solana Explorer**
Visit [explorer.solana.com](https://explorer.solana.com) and search for your program ID.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Join our Discord community

---

**Happy Treasure Hunting! 🗺️💎** 