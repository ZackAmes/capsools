use starknet::{ContractAddress};


#[derive(Model, Drop, Serde)]
struct Manager {
    #[key]
    owner: ContractAddress,
    #[key]
    label: felt252,
    #[key]
    index: u32,
    id: u32
}



