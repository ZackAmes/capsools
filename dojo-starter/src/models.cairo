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

#[derive(Model, Drop, Serde)]
struct GameManager {
    #[key]
    player: ContractAddress,
    #[key]
    index: u32,
    game_id: u32
}

#[derive(Model, Drop, Serde)]
struct PieceManager {
    #[key]
    palyer:ContractAddress,
    #[key]
    index: u32,
    piece: u8
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