use starknet::ContractAddress;

#[derive(Model, Drop, Serde)]
struct Game {
    #[key]
    id: u32,
    data: GameData
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
    turn_count: u32,
    is_active: bool,
    ones_turn: bool
}

#[generate_trait]
impl GameImpl of GameTrait {

    fn new(id: u32, team_one: u32) -> Game {
        let data = GameData {
            team_one,
            team_two: 0,
            turn_count: 0,
            is_active: false,
            ones_turn: true
        };

        Game {id, data}
    }

    fn accept(ref self: Game, team_two:u32) {
        self.data.team_two = team_two;
        self.data.is_active = true;
    }


    
}





