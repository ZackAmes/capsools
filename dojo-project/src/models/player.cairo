use starknet::ContractAddress;
use project::models::piece::{Piece, PieceTrait};


#[derive(Model, Drop, Serde)]
struct Player {
    #[key]
    address: ContractAddress,
    name: felt252,
    counts: Counts
}

#[derive(Copy, Drop, Serde, Introspect)]
struct Counts {
    game_count: u32,
    piece_count: u32
}



trait PlayerTrait {
    fn new(address: ContractAddress, name: felt252) -> Player;

    fn games_count(ref self: Player) -> u32;
    fn pieces_count(ref self: Player) -> u32;

    fn increment_games(ref self: Player);
    fn increment_pieces(ref self: Player);

}

impl PlayerImpl of PlayerTrait {
    fn new(address: ContractAddress, name: felt252) -> Player {
        let counts = Counts {game_count:0, piece_count: 0};
        Player { address, name , counts}
    }

    fn games_count(ref self: Player) -> u32 {
        self.counts.game_count
    }

    fn pieces_count(ref self: Player) -> u32 {
        self.counts.piece_count
    }

    fn increment_games(ref self: Player) {
        self.counts.game_count =  self.games_count() + 1;
    }

    fn increment_pieces(ref self: Player) {
        self.counts.piece_count += 1;
    }

}






