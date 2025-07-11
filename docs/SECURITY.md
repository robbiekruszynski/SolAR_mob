# Security Guidelines

## Environment Variables

This project uses environment variables to protect sensitive information. Never commit actual API keys, private keys, or sensitive configuration to version control.

### Required Environment Variables

Create a `.env` file in the `app/` directory with the following variables:

```bash
# Solana Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_WS_URL=wss://api.devnet.solana.com
SOLANA_NETWORK=devnet

# Program IDs
TREASURE_HUNT_PROGRAM_ID=your_program_id_here

# Token Configuration
BONK_TOKEN_MINT=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263

# API Keys (if needed)
AR_API_KEY=your_ar_api_key_here
MAPS_API_KEY=your_maps_api_key_here

# Development Configuration
DEBUG_MODE=true
MOCK_WALLET_ADDRESS=your_mock_wallet_address_here
```

### Security Best Practices

1. **Never commit `.env` files** - They are already in `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Validate configuration** on app startup
4. **Use different keys** for development and production
5. **Rotate keys regularly** in production

### Sensitive Information Removed

The following sensitive information has been moved to environment variables:

- ✅ BONK token mint address
- ✅ Program IDs
- ✅ RPC endpoints
- ✅ Mock wallet addresses
- ✅ API keys (placeholders)

### Configuration Validation

The app validates required configuration on startup:

```typescript
import { validateConfig } from './src/services/config';

// This will throw an error if required config is missing
validateConfig();
```

### Production Deployment

For production deployment:

1. Set up environment variables in your deployment platform
2. Use production RPC endpoints
3. Use real program IDs (not test ones)
4. Disable debug mode
5. Use real API keys

### Development vs Production

| Environment | RPC URL | Program ID | Debug Mode |
|-------------|---------|------------|------------|
| Development | Devnet | Test ID | Enabled |
| Production | Mainnet | Real ID | Disabled |

## Architecture Security

### Service Layer Separation

The app uses a service layer to separate concerns:

- `config.ts` - Environment configuration
- `wallet.ts` - Wallet operations
- `treasure.ts` - Treasure hunting logic
- `location.ts` - GPS services

### Context-Based State Management

State is managed through React Context to avoid prop drilling and centralize sensitive operations.

### Input Validation

All user inputs are validated before processing to prevent injection attacks.

## Reporting Security Issues

If you find a security vulnerability:

1. **Do not create a public issue**
2. **Email the maintainers directly**
3. **Include detailed reproduction steps**
4. **Wait for acknowledgment**

## Security Checklist

- [x] Environment variables for sensitive data
- [x] Configuration validation
- [x] Service layer separation
- [x] Input validation
- [x] Secure file handling
- [x] Error handling without information leakage
- [x] .gitignore protection
- [x] Documentation of security practices 