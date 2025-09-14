import React, { useState, useEffect } from 'react';
import { useUserRegistry } from '../hooks/useContract';
import { waitForTransaction, getWalletAccount, isWalletConnected, executeTransaction } from '../utils/starknet';

const UserRegistry = ({ wallet, onAccountCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: ''
  });
  const [transactionHash, setTransactionHash] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletStatus, setWalletStatus] = useState({});

  // Debug wallet status
  useEffect(() => {
    const checkWalletStatus = () => {
      try {
        const connected = isWalletConnected();
        const account = connected ? getWalletAccount() : null;
        
        setWalletStatus({
          isConnected: connected,
          hasAccount: !!account,
          address: account?.address || null,
          error: null
        });
      } catch (err) {
        setWalletStatus({
          isConnected: false,
          hasAccount: false,
          address: null,
          error: err.message
        });
      }
    };

    checkWalletStatus();
    
    // Check every 2 seconds
    const interval = setInterval(checkWalletStatus, 2000);
    return () => clearInterval(interval);
  }, [wallet]);

  // DIRECT CONTRACT INTERACTION METHOD
  const handleSubmitDirect = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    setTransactionHash('');

    try {
      // Validate inputs
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 1 || age > 120) {
        throw new Error('Age must be between 1 and 120');
      }

      // Check wallet connection
      if (!isWalletConnected()) {
        throw new Error('Wallet not connected');
      }

      // Direct contract interaction - REPLACE WITH YOUR CONTRACT ADDRESS
      const CONTRACT_ADDRESS = "0x06a4a3988dec2621eb61a20ba0869098fc93bf6e2ffad4cbb7b56c536d220524";
      
      console.log('Calling executeTransaction directly...');
      const result = await executeTransaction(
        CONTRACT_ADDRESS,
        'create_account', // or whatever your function name is
        [formData.name.trim(), age] // adjust calldata format as needed
      );
      
      setTransactionHash(result.transaction_hash);

      // Wait for transaction confirmation
      console.log('Waiting for transaction confirmation...');
      await waitForTransaction(result.transaction_hash);
      
      setSuccess(true);
      setFormData({ name: '', age: '' });
      
      if (onAccountCreated) {
        onAccountCreated();
      }

    } catch (err) {
      console.error('Account creation failed:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) {
      setError(null);
    }
  };

  if (!wallet) {
    return (
      <div className="bg-gray-50 border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Create Account</h3>
        <p className="text-gray-500">Connect your wallet to create an account</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-lg font-semibent mb-4">Create New Account</h3>
      
      {/* Detailed Debug Info */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
        <h4 className="font-semibold mb-2">Wallet Status:</h4>
        <div className="space-y-1">
          <p>Connected: {walletStatus.isConnected ? '✅' : '❌'}</p>
          <p>Has Account: {walletStatus.hasAccount ? '✅' : '❌'}</p>
          <p>Address: {walletStatus.address ? `${walletStatus.address.slice(0, 10)}...` : 'N/A'}</p>
          {walletStatus.error && (
            <p className="text-red-600">Error: {walletStatus.error}</p>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmitDirect} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your name"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your age"
            min="1"
            max="120"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !walletStatus.isConnected || !walletStatus.hasAccount}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      {/* Transaction status */}
      {transactionHash && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            Transaction submitted: 
            <a 
              href={`https://sepolia.starkscan.co/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 underline hover:no-underline"
            >
              View on Explorer
            </a>
          </p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-800">
            Account created successfully!
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800">
            Error: {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserRegistry;