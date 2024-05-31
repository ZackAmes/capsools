use starknet::ContractAddress;
use dojo_starter::models::position::Vec2;

#[derive(Drop, Serde)]
#[dojo::model]
struct Game {
    #[key]
    game_id: u32,
    player_one: ContractAddress,
    player_two: ContractAddress,
    status: GameStatus,
    moves: Array<Move>
}

#[derive( Drop, Serde, Introspect)]
struct Move {
    actions: Array<Action>
}

#[derive(Copy, Drop, Serde, Introspect)]
struct Action {
    piece_id: u32,
    action_type: ActionType,
    target: Vec2
}

#[derive(Copy, Drop, Serde, Introspect)]
enum ActionType {
    Move,
    Attack,
    Ability
}


#[derive(Copy, Drop, Serde, Introspect)]
enum GameStatus {
    Inactive,
    Active, 
    Finished
}
