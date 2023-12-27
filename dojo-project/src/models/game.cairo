use starknet::ContractAddress;

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

#[derive(Copy, Drop, Serde, Introspect, PartialEq)]
struct Vec2 {
    x: u8,
    y: u8
}

#[derive(Copy, Drop, Serde, Introspect)]
struct GameData {
    team_one: u32,
    team_two: u32,
    ones_turn: bool
}

trait GameTrait {
    fn new(id: u32, team_one: u32, team_two: u32) -> Game;

    fn turn_player(ref self: Game) -> u32;
}

impl GameImpl of GameTrait {

    fn new(id: u32, team_one: u32, team_two: u32) -> Game {
        let data = GameData {
            team_one,
            team_two,
            ones_turn: true
        };

        Game {id, data}
    }

    fn turn_player(ref self: Game) -> u32 {
        
        let data = self.data;

        if(data.ones_turn) {
            data.team_one
        }
        else {
            data.team_two
        }
    }

    
}





