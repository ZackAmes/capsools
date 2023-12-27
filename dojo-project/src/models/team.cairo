use project::models::piece::{Piece, PieceTrait};
use starknet::{ContractAddress};

#[derive(Model, Drop, Serde)]
struct Team {
    #[key]
    id: u32,
    owner: felt252,
    piece_count: u8,
    piece_one: u32,
    piece_two: u32
}

trait TeamTrait {
    fn new(id: u32, owner: felt252) -> Team;

    fn add_piece(ref self: Team, piece_id: u32);
    fn remove_piece(ref self: Team, piece_id: u32);

    fn can_add(ref self: Team) -> bool;
    fn contains(ref self: Team, piece_id: u32) -> bool;

}

impl TeamImpl of TeamTrait {

    fn new(id: u32, owner: felt252) -> Team {
        Team {id, owner, piece_count:0, piece_one:0, piece_two:0}
    }

    fn add_piece(ref self: Team, piece_id: u32) {
        assert(self.can_add(), 'team full');
        
        if(self.piece_count == 0) {
            self.piece_one = piece_id;
        }
        else {
            self.piece_two = piece_id;
        }
    }

    fn remove_piece(ref self: Team, piece_id: u32) {
        assert(self.contains(piece_id), 'piece not in team');

        if(self.piece_one == piece_id) {
            self.piece_one = 0;
        }
        else {
            self.piece_two = 0;
        }
        self.piece_count -=1;
    }

    fn can_add(ref self: Team) -> bool {
        self.piece_count < 2
    }

    fn contains(ref self: Team, piece_id: u32) -> bool {
        assert(piece_id != 0, 'piece id cannot be 0');
        self.piece_one == piece_id || self.piece_two == piece_id
        
    }


}