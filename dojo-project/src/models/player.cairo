use starknet::ContractAddress;
use project::models::piece::{Piece, PieceTrait};


#[derive(Model, Drop, Serde)]
struct Player {
    #[key]
    address: felt252,
    name: felt252,
    counts: Counts,
    points: u32
}

#[derive(Copy, Drop, Serde, Introspect)]
struct Counts {
    game_count: u32,
    piece_count: u32,
    team_count: u32
}

trait PlayerTrait {
    fn new(address: felt252, name: felt252, points: u32) -> Player;

    fn add(ref self: Player, points: u32);
    fn sub(ref self: Player, points: u32);

}

impl PlayerImpl of PlayerTrait {
    fn new(address: felt252, name: felt252, points: u32) -> Player {
        let counts = Counts {game_count:0, piece_count: 0, team_count: 0};
        Player { address, name , counts, points}
    }

    fn add(ref self: Player, points: u32) {
        self.points += points;
    }

    fn sub(ref self: Player, points: u32) {
        if(self.points > points) {
            self.points = 0;
        }
        else {
            self.points - points;
        }
    }

}






