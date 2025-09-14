import React, { useState, useEffect } from 'react';
import { formatAddress, connectWallet, disconnectWallet, isWalletConnected, getWalletAddress } from '../utils/starknet';

const WalletConnection = ({ onWalletChange }) => {
  const [wallet, setWallet] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = () => {
      if (isWalletConnected()) {
        const address = getWalletAddress();
        setWallet({ address });
      }
    };
    checkConnection();
  }, []);

  const handleConnectWallet = async () => {
    setConnecting(true);
    setError('');
    
    try {
      const walletInfo = await connectWallet();
      console.log("connected account:", walletInfo);
      setWallet(walletInfo);
      
      // Notify parent component about wallet change
      if (onWalletChange) {
        onWalletChange(walletInfo);
      }
    } catch (error) {
      console.error("connection failed:", error);
      setError(error.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setWallet(null);
      setError('');
      
      // Notify parent component about wallet change
      if (onWalletChange) {
        onWalletChange(null);
      }
    } catch (error) {
      console.log("disconnection failed:", error);
      setError(error.message);
    }
  };

  return (
    <div className="bg-white shadow-sm border rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Wallet Connection</h2>
      
      {!wallet ? (
        <div>
          <p className="text-gray-600 mb-3">Connect your wallet to interact with the contract</p>
          <button
            onClick={handleConnectWallet}
            disabled={connecting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
          {error && (
            <p className="text-red-500 text-sm mt-2">Error: {error}</p>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected Address:</p>
              <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {formatAddress(wallet.address)}
              </p>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;