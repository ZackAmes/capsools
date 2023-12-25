use starknet::ContractAddress;
use project::models::piece::{Piece};

#[derive(Model, Drop, Serde)]
struct Game {
    #[key]
    id: u32,
    data: GameData
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

#[derive(Copy, Drop, Serde, Introspect)]
struct GameData {
    team_one: Team,
    team_two: Team,
    ones_turn: bool
}

#[derive(Copy, Drop, Serde, Introspect)]
struct Team {
    player: ContractAddress
}

trait GameTrait {
    fn new(id: u32, player_one: ContractAddress, player_two: ContractAddress) -> Game;

    fn turn_player(ref self: Game) -> ContractAddress;
}

impl GameImpl of GameTrait {
    fn new(id: u32, player_one: ContractAddress, player_two: ContractAddress) -> Game {
        let data = GameData {
            team_one: Team {player: player_one},
            team_two: Team {player: player_two},
            ones_turn: true
        };

        Game {id, data}
    }

    fn turn_player(ref self: Game) -> ContractAddress {
        if(self.data.ones_turn) {
            self.data.team_one.player
        }
        else {
            self.data.team_two.player
        }
    }
}





