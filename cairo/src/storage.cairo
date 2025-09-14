
use starknet::ContractAddress;
#[starknet::contract]
mod Storage {
    
    #[storage]
    struct Storage {
        value:u128 ,
    }
   
     #[abi(embed_v0)]
    impl HelloStarknetImpl of super::IHelloStarknet<ContractState> {
         
    fn set_value(ref self: ContractState, new_value: u128){
        self.value.write(new_value);
    }

    
    fn get_value(self: @ContractState)->u128 {
        self.value.read()
    }
    }
}
