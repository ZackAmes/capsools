use project::models::game::{Vec2};



#[derive(Model, Drop, Serde)]
struct Piece {
    #[key]
    id: u32,
    data: PieceData
}

#[derive(Copy, Drop, Serde, Introspect)]
struct PieceData {
   owner: felt252,
   location: felt252
}

trait PieceTrait {
    fn new(id: u32, owner: felt252) -> Piece;
    fn check_move_valid(ref self: Piece, next: Vec2) -> bool;

    fn is_available(ref self: Piece) -> bool;

    fn owner(ref self: Piece) -> felt252;
    fn update_location(ref self: Piece, location: felt252);
}

impl PieceImpl of PieceTrait {

    fn new(id: u32, owner: felt252) -> Piece {  
        let data = PieceData {owner, location: owner}; 
        Piece {id, data}
    }

    #[inline(always)]
    fn check_move_valid(ref self: Piece, next:Vec2) -> bool {
        return true;
    }

    #[inline(always)]
    fn is_available(ref self: Piece) -> bool {
        return self.data.owner == self.data.location;
    }

    #[inline(always)]
    fn owner(ref self: Piece) -> felt252 {
        return self.data.owner;
    }

    #[inline(always)]
    fn update_location(ref self: Piece, location: felt252) {
        self.data.location = location;
    }

    
}


