# Time-Locked Wallet

A secure cryptocurrency wallet with time-based access control and multi-signature functionality built with Solidity and React.

## Features

### Smart Contract Features
- **Time-based Access Control**: Funds are locked until a specified timestamp
- **Owner Access Control**: Only the contract owner can extend lock time and manage whitelist
- **Whitelist Management**: Multiple addresses can be whitelisted for withdrawal access
- **Secure Withdrawals**: Only owner or whitelisted addresses can withdraw after unlock time
- **Event Logging**: All key actions emit events for transparency

### Frontend Features
- **Modern UI/UX**: Beautiful glassmorphism design with smooth animations
- **Web3 Integration**: Connect with MetaMask and other Web3 wallets
- **Real-time Updates**: Live countdown timer and balance updates
- **Responsive Design**: Works on desktop and mobile devices
- **Interactive Elements**: Hover effects, loading states, and smooth transitions

## Smart Contract

The `TimeLockedWallet.sol` contract includes:

- `constructor(uint256 _unlockTimestamp)`: Deploy with unlock timestamp
- `withdraw()`: Withdraw funds (only after unlock time, only owner/whitelisted)
- `extendUnlockTime(uint256 _newUnlockTimestamp)`: Extend lock time (owner only)
- `addToWhitelist(address _account)`: Add address to whitelist (owner only)
- `receive()`: Accept ETH deposits

### Events
- `FundsDeposited(address indexed sender, uint256 amount, uint256 timestamp)`
- `FundsWithdrawn(address indexed recipient, uint256 amount, uint256 timestamp)`
- `UnlockTimeExtended(uint256 oldTimestamp, uint256 newTimestamp)`
- `AddressWhitelisted(address indexed account)`

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd time-locked-wallet
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

## Usage

### For Development
1. Connect your Web3 wallet (MetaMask recommended)
2. Deploy a new contract or connect to an existing one
3. Set the unlock timestamp when deploying
4. Deposit funds to the contract
5. Manage whitelisted addresses (owner only)
6. Withdraw funds after unlock time

### For Production
1. Deploy the smart contract to your preferred network
2. Update the contract address in the frontend
3. Build and deploy the frontend application

## Technology Stack

- **Smart Contract**: Solidity ^0.8.0, OpenZeppelin
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion
- **Web3**: ethers.js, MetaMask integration
- **Icons**: Lucide React

## Project Structure

```
time-locked-wallet/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── WalletConnection.jsx
│   │   └── ContractDeployment.jsx
│   ├── hooks/
│   │   └── useWeb3.js       # Web3 integration hook
│   ├── App.jsx              # Main application component
│   ├── App.css              # Custom styles and animations
│   └── main.jsx             # Application entry point
├── TimeLockedWallet.sol     # Smart contract
├── package.json
└── README.md
```

## Security Considerations

- Always verify contract addresses before interacting
- Test thoroughly on testnets before mainnet deployment
- Keep private keys secure and never share them
- Understand the implications of time-locked funds
- Only whitelist trusted addresses

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For questions or issues, please open an issue on the GitHub repository.

