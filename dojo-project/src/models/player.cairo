use starknet::ContractAddress;


#[derive(Model, Drop, Serde)]
struct Secret {
    #[key]
    player: ContractAddress,
    value: u8
}

#[derive(Model, Drop, Serde)]
struct Player {
    #[key]
    address: ContractAddress,
    games_count: u32,
    pieces_count: u32
}


