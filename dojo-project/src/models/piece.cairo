use starknet::ContractAddress;
use project::models::game::{Vec2};

#[derive(Model, Drop, Serde)]
struct PieceManager {
    #[key]
    owner:ContractAddress,
    #[key]
    index: u32,
    piece_id: u32
}

#[derive(Model, Drop, Serde)]
struct Piece {
    #[key]
    piece_id: u32,
    owner: ContractAddress,
    location: ContractAddress,
    piece_type: PieceType
}


trait PieceTrait {
    fn check_move_valid(self: @Piece, next: Vec2) -> bool;

    fn check_available(self: @Piece) -> bool;
    
}

impl PieceImpl of PieceTrait {

    fn check_move_valid(self: @Piece, next:Vec2) -> bool {
        true
    }

    fn check_available(self: @Piece) -> bool {
        return self.owner == self.location;
    }
    
}

#[derive(Serde, Drop, Copy, PartialEq, Introspect)]
enum PieceType {
    X,
    O
}



