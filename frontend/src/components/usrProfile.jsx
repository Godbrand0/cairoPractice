import React, { useState, useEffect } from 'react';
import { useUserRegistry } from '../hooks/useContract';
import { formatAddress } from '../utils/starknet';

const UserProfile = ({ wallet }) => {
  const { getUserAccount, userExists, loading } = useUserRegistry();
  const [user, setUser] = useState(null);
  const [exists, setExists] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async () => {
    if (!wallet?.address) return;
    
    setRefreshing(true);
    try {
      const [userData, userExistsResult] = await Promise.all([
        getUserAccount(wallet.address),
        userExists(wallet.address)
      ]);
      
      setUser(userData);
      setExists(userExistsResult);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [wallet?.address]);

  if (!wallet) {
    return (
      <div className="bg-gray-50 border rounded-lg p-4">
        <p className="text-gray-500">Connect wallet to view profile</p>
      </div>
    );
  }

  if (loading || refreshing) {
    return (
      <div className="bg-white border rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">User Profile</h3>
        <button
          onClick={fetchUserData}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          Refresh
        </button>
      </div>

      {exists && user ? (
        <div className="space-y-2">
          <div>
            <span className="text-sm text-gray-600">Name:</span>
            <span className="ml-2 font-medium">{user.name || 'N/A'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Age:</span>
            <span className="ml-2 font-medium">{user.age || 'N/A'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Address:</span>
            <span className="ml-2 font-mono text-xs bg-gray-100 px-1 rounded">
              {formatAddress(user.account_address || wallet.address)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No account found</p>
          <p className="text-sm text-gray-400">Create an account to get started</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;