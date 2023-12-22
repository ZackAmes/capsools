use starknet::ContractAddress;
use project::models::piece::{Piece};

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
    position: Vec2,
    state: u32
}

#[derive(Copy, Drop, Serde, Introspect)]
struct Vec2 {
    x: u8,
    y: u8
}
