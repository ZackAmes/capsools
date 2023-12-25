use starknet::ContractAddress;
use project::models::game::{Vec2};



#[derive(Model, Drop, Serde)]
struct Piece {
    #[key]
    piece_id: u32,
    data: PieceData
}

#[derive(Copy, Drop, Serde, Introspect)]
struct PieceData {
   owner: ContractAddress,
   location: ContractAddress
}

trait PieceTrait {
    fn new(id: u32, owner: ContractAddress) -> Piece;
    fn check_move_valid(self: Piece, next: Vec2) -> bool;

    fn check_available(self: Piece) -> bool;

    fn owner(self: Piece) -> ContractAddress;
}

impl PieceImpl of PieceTrait {

    fn new(id: u32, owner: ContractAddress) -> Piece {
        
        let data = PieceData {owner, location: owner}; 
        Piece {piece_id: id, data}
    }

    fn check_move_valid(self: Piece, next:Vec2) -> bool {
        return true;
    }

    fn check_available(self: Piece) -> bool {
        return self.data.owner == self.data.location;
    }

    fn owner(self: Piece) -> ContractAddress {

        return self.data.owner;
    }

    
}


