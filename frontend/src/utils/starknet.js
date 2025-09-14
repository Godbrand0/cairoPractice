
import { RpcProvider } from 'starknet';
import { CURRENT_NETWORK } from './constants';
import { connect, disconnect } from "get-starknet";

// Create provider instance
export const provider = new RpcProvider({
  nodeUrl: CURRENT_NETWORK.rpcUrl
});

// Global wallet state
let walletInstance = null;

// Connect wallet with modal popup
export const connectWallet = async () => {
  try {
    walletInstance = await connect({
      modalMode: "always",
      include: ["braavos", "argentX"],
    });

    if (walletInstance) {
      // IMPORTANT: Enable the wallet first
      await walletInstance.enable();
      
      // Verify the wallet is properly connected
      if (!walletInstance.isConnected) {
        throw new Error('Wallet connection failed');
      }
      
      // Verify account exists
      if (!walletInstance.account) {
        throw new Error('No account found in wallet');
      }

      const address = walletInstance.account.address;
      
      console.log('Wallet connected successfully:', {
        name: walletInstance.name,
        address: formatAddress(address),
        isConnected: walletInstance.isConnected,
        account: !!walletInstance.account
      });

      return {
        wallet: walletInstance,
        account: walletInstance.account,
        address,
        isConnected: true
      };
    } else {
      throw new Error('No wallet selected');
    }
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    walletInstance = null;
    throw error;
  }
};

// Disconnect wallet
export const disconnectWallet = async () => {
  try {
    if (walletInstance) {
      await disconnect();
      walletInstance = null;
      console.log('Wallet disconnected');
      return true;
    }
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
    throw error;
  }
};

// Get current wallet instance
export const getWallet = () => {
  return walletInstance;
};

// Check if wallet is connected
export const isWalletConnected = () => {
  return walletInstance && walletInstance.isConnected;
};

// Get wallet account - THIS IS THE KEY FUNCTION
export const getWalletAccount = () => {
  console.log('getWalletAccount called:', {
    walletInstance: !!walletInstance,
    isConnected: walletInstance?.isConnected,
    hasAccount: !!walletInstance?.account
  });
  
  if (!walletInstance) {
    throw new Error('No wallet instance found');
  }
  
  if (!walletInstance.isConnected) {
    throw new Error('Wallet not connected');
  }
  
  if (!walletInstance.account) {
    throw new Error('No account available in wallet');
  }
  
  return walletInstance.account;
};

// Get wallet address
export const getWalletAddress = () => {
  if (!walletInstance || !walletInstance.isConnected || !walletInstance.account) {
    return null;
  }
  return walletInstance.account.address;
};

// Helper function to format addresses
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper function to handle felt252 conversion
export const stringToFelt = (str) => {
  return str;
};

export const feltToString = (felt) => {
  if (typeof felt === 'bigint') {
    return felt.toString();
  }
  return felt;
};

// Helper to wait for transaction
export const waitForTransaction = async (transactionHash) => {
  console.log(`Waiting for transaction: ${transactionHash}`);
  const receipt = await provider.waitForTransaction(transactionHash);
  console.log('Transaction confirmed:', receipt);
  return receipt;
};

// Execute transaction with connected wallet - DIRECT METHOD
export const executeTransaction = async (contractAddress, entrypoint, calldata = []) => {
  console.log('executeTransaction called with:', {
    contractAddress,
    entrypoint,
    calldata,
    walletInstance: !!walletInstance,
    isConnected: walletInstance?.isConnected,
    hasAccount: !!walletInstance?.account
  });

  if (!walletInstance) {
    throw new Error('No wallet connected');
  }

  if (!walletInstance.isConnected) {
    throw new Error('Wallet not connected');
  }

  if (!walletInstance.account) {
    throw new Error('No account available');
  }

  try {
    const account = walletInstance.account;
    
    const transaction = await account.execute({
      contractAddress,
      entrypoint,
      calldata
    });

    console.log('Transaction sent:', transaction.transaction_hash);
    
    return {
      transaction_hash: transaction.transaction_hash,
      transaction
    };
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};