import { useState, useEffect, useCallback } from 'react';
import { UserRegistryContract } from '../contracts/userRegistry';

export const useUserRegistry = (account = null) => {
  const [contract] = useState(() => new UserRegistryContract(account));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create account function
  const createAccount = useCallback(async (name, age) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await contract.createAccount(name, age);
      console.log("acount created:", result);
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // Get user account function
  const getUserAccount = useCallback(async (address) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await contract.getUserAccount(address);
         console.log("user account:", result);
      return result;
   
      
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // Check if user exists
  const userExists = useCallback(async (address) => {
    try {
      return await contract.userExists(address);
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [contract]);

  return {
    createAccount,
    getUserAccount,
    userExists,
    loading,
    error,
    setError
  };
};

// export const useWallet = () => {
//   const [wallet, setWallet] = useState(null);
//   const [connecting, setConnecting] = useState(false);
//   const [error, setError] = useState(null);

//   const connect = useCallback(async () => {
//     setConnecting(true);
//     setError(null);
    
//     try {
//       const { connect } = await import('starknetkit');
//       const { wallet } = await connect();
//       setWallet(wallet);
//       return wallet;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setConnecting(false);
//     }
//   }, []);

//   const disconnect = useCallback(async () => {
//     try {
//       const { disconnect } = await import('starknetkit');
//       await disconnect();
//       setWallet(null);
//     } catch (err) {
//       console.error('Disconnect error:', err);
//     }
//   }, []);

//   return {
//     wallet,
//     connect,
//     disconnect,
//     connecting,
//     error
//   };
// };