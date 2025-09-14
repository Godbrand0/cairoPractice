import React, { useState } from 'react';
import WalletConnection from './components/walletConnect';
import UserProfile from './components/usrProfile';
import UserRegistry from './components/userRegistry';
import './App.css';

function App() {
  const [wallet, setWallet] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWalletChange = (walletInfo) => {
    setWallet(walletInfo);
  };

  const handleAccountCreated = () => {
    // Trigger profile refresh
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Registry DApp
          </h1>
          <p className="text-gray-600">
            A decentralized user registration system on Starknet
          </p>
        </header>

        <div className="space-y-6">
          {/* Wallet Connection */}
          <WalletConnection onWalletChange={handleWalletChange} />

          {/* User Profile */}
          <UserProfile wallet={wallet} key={refreshTrigger} />

          {/* Account Creation Form */}
          <UserRegistry 
            wallet={wallet} 
            onAccountCreated={handleAccountCreated}
          />

          {/* Contract Info */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Contract Information</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-600">Network:</span>
                <span className="ml-2">Starknet Sepolia</span>
              </p>
              <p>
                <span className="text-gray-600">Contract:</span>
                <a 
                  href="https://sepolia.starkscan.co/contract/0x06a4a3988dec2621eb61a20ba0869098fc93bf6e2ffad4cbb7b56c536d220524"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 hover:underline font-mono text-xs"
                >
                  0x06a4...0524
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;