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
export const CONTRACT_ADDRESS = '0x06a4a3988dec2621eb61a20ba0869098fc93bf6e2ffad4cbb7b56c536d220524';

// Wallet connection options
export const WALLET_OPTIONS = {
  argentX: { id: 'argentX', name: 'ArgentX' },
  braavos: { id: 'braavos', name: 'Braavos' }
};