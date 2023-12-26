use starknet::ContractAddress;
use project::models::piece::{Piece, PieceTrait};


#[derive(Model, Drop, Serde)]
struct Player {
    #[key]
    address: felt252,
    name: felt252,
    counts: Counts
}

#[derive(Copy, Drop, Serde, Introspect)]
struct Counts {
    game_count: u32,
    piece_count: u32,
    team_count: u32
}

trait PlayerTrait {
    fn new(address: felt252, name: felt252) -> Player;

    fn game_count(ref self: Player) -> u32;
    fn piece_count(ref self: Player) -> u32;
    fn team_count(ref self: Player) -> u32;

    fn increment_games(ref self: Player);
    fn increment_pieces(ref self: Player);
    fn increment_teams(ref self: Player);

}

impl PlayerImpl of PlayerTrait {
    fn new(address: felt252, name: felt252) -> Player {
        let counts = Counts {game_count:0, piece_count: 0, team_count: 0};
        Player { address, name , counts}
    }

    fn game_count(ref self: Player) -> u32 {
        self.counts.game_count
    }

    fn piece_count(ref self: Player) -> u32 {
        self.counts.piece_count
    }

    fn team_count(ref self: Player) -> u32 {
        self.counts.team_count
    }

    fn increment_teams(ref self: Player) {
        self.counts.team_count = self.team_count() + 1;
    }

    fn increment_games(ref self: Player) {
        self.counts.game_count =  self.game_count() + 1;
    }

    fn increment_pieces(ref self: Player) {
        self.counts.piece_count += 1;
    }

}






