// SPDX-License-Identifier: MIT
#[starknet::contract]
mod UserRegistry {
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, 
        Map, StoragePathEntry, Vec, VecTrait, MutableVecTrait
    };

    // ----------------------------
    // Struct to hold user details
    // ----------------------------
    #[derive(Drop, Serde, starknet::Store)]
    struct User {
        name: felt252,
        age: u8,
        account_address: ContractAddress,
    }

    // ----------------------------
    // Storage variables
    // ----------------------------
    #[storage]
    struct Storage {
        admin: ContractAddress,
        users: Map<ContractAddress, User>,
        user_count: u32,
        user_addresses: Map<u32, ContractAddress>, // index => address mapping
    }

    // ----------------------------
    // Constructor (set admin)
    // ----------------------------
    #[constructor]
    fn constructor(ref self: ContractState) {
        let caller = get_caller_address();
        self.admin.write(caller);
        self.user_count.write(0);
    }

    // ----------------------------
    // Create an account
    // ----------------------------
    #[abi(embed_v0)]
    impl UserRegistryImpl of IUserRegistry<ContractState> {
        fn create_account(ref self: ContractState, name: felt252, age: u8) {
            let caller = get_caller_address();
            
            // Check if user already exists (this will panic if user doesn't exist)
            let existing_user = self.users.entry(caller).read();
            
            // Since we can't easily check if user exists without panicking,
            // we'll use a different approach - check if name is 0 (default value)
            assert!(existing_user.name == 0, "Account already exists!");

            let user = User {
                name,
                age,
                account_address: caller,
            };

            // Store the user
            self.users.entry(caller).write(user);
            
            // Add to user list for admin functionality
            let current_count = self.user_count.read();
            self.user_addresses.entry(current_count).write(caller);
            self.user_count.write(current_count + 1);
        }

        // ----------------------------
        // Get caller's account
        // ----------------------------
        fn get_my_account(self: @ContractState) -> User {
            let caller = get_caller_address();
            self.users.entry(caller).read()
        }

        // ----------------------------
        // Admin-only: get user count
        // ----------------------------
        fn get_user_count(self: @ContractState) -> u32 {
            let caller = get_caller_address();
            let admin = self.admin.read();
            
            assert!(caller == admin, "Only admin can call this function!");
            self.user_count.read()
        }

        
        fn get_user_by_index(self: @ContractState, index: u32) -> User {
            let caller = get_caller_address();
            let admin = self.admin.read();
            
            assert!(caller == admin, "Only admin can call this function!");
            assert!(index < self.user_count.read(), "Index out of bounds!");
            
            let user_address = self.user_addresses.entry(index).read();
            self.users.entry(user_address).read()
        }

        // ----------------------------
        // Check if user exists
        // ----------------------------
        fn user_exists(self: @ContractState, user_address: ContractAddress) -> bool {
            let user = self.users.entry(user_address).read();
            user.name != 0 // Assuming name = 0 means user doesn't exist
        }
    }

    // ----------------------------
    // Interface definition
    // ----------------------------
    #[starknet::interface]
    trait IUserRegistry<TContractState> {
        fn create_account(ref self: TContractState, name: felt252, age: u8);
        fn get_my_account(self: @TContractState) -> User;
        fn get_user_count(self: @TContractState) -> u32;
        fn get_user_by_index(self: @TContractState, index: u32) -> User;
        fn user_exists(self: @TContractState, user_address: ContractAddress) -> bool;
    }
}