use starknet::ContractAddress;

#[derive(Model, Drop, Serde)]
struct GameManager {
    #[key]
    player: ContractAddress,
    #[key]
    index: u32,
    game_id: u32
}


#[derive(Model, Drop, Serde)]
struct Game {
    #[key]
    game_id: u32,
    player_one: ContractAddress,
    player_two: ContractAddress,
    ones_turn: bool
}

#[derive(Model, Drop, Serde)]
struct Square {
    #[key]
    game_id: u32,
    #[key]
    x: u8,
    #[key]
    y: u8,
    value: u8
}