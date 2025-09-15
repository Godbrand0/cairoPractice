// Network configuration
export const NETWORKS = {
  SEPOLIA: {
    name: 'Sepolia',
    rpcUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_6',
    explorerUrl: 'https://sepolia.starkscan.co'
  },
  MAINNET: {
    name: 'Mainnet', 
    rpcUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_6',
    explorerUrl: 'https://starkscan.co'
  }
};

export const CURRENT_NETWORK = NETWORKS.SEPOLIA; // Change as needed

// Replace with your deployed contract address
export const CONTRACT_ADDRESS = '0x075938a164b38e637d3e5ed07f138872ca423a2150ca1927edb7a81e93d425d5';

// Wallet connection options
export const WALLET_OPTIONS = {
  argentX: { id: 'argentX', name: 'ArgentX' },
  braavos: { id: 'braavos', name: 'Braavos' }
};