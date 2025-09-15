import { Contract } from 'starknet';
import { provider } from '../utils/starknet';
import { CONTRACT_ADDRESS } from '../utils/constants';
import UserRegistryABI from './abi/UserRegistry.abi.json';

// Create read-only contract instance
export const contract = new Contract(
  UserRegistryABI,
  CONTRACT_ADDRESS,
  provider
);

// Contract interaction functions
export class UserRegistryContract {
  constructor(account = null) {
    this.contract = account 
      ? new Contract(UserRegistryABI, CONTRACT_ADDRESS, account)
      : contract;
  }

  // Read functions (no gas required)
async getUserAccount() {
  try {
    const result = await this.contract.get_my_account();
    return {
      name: result.name?.toString() || '',
      age: Number(result.age) || 0,
      account_address: result.account_address || ''
    };
  } catch (error) {
    console.error('Error fetching user account:', error);
    return null;
  }
}

async userExists(address) {
  try {
    const result = await this.contract.user_exists({ user_address: address });
    return result;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
}

async userCount() {
  try {
    const result = await this.contract.get_user_count();
    return result;
  } catch (error) {
    console.error("Error checking user count:", error);
    return 0;
  }
}

async createAccount(name, age) {
  if (!this.contract.account) {
    throw new Error('No account connected. Cannot perform write operations.');
  }

  try {
    console.log(`Creating account: ${name}, age: ${age}`);
    
    const tx = await this.contract.create_account({ name, age });
    
    console.log('Transaction sent:', tx.transaction_hash);
    await provider.waitForTransaction(tx.transaction_hash);
    return tx;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}
}

// Export default read-only instance
export default new UserRegistryContract();