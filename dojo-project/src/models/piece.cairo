use project::models::game::{Vec2};
use starknet::OptionTrait;


#[derive(Model, Drop, Serde)]
struct Piece {
    #[key]
    id: u32,
    data: PieceData
}

#[derive(Copy, Drop, Serde, Introspect)]
struct PieceData {
   owner: felt252,
   location: felt252,
   position: Vec2,
   piece_type: PieceType
}

#[derive(Copy, Drop, Serde, Introspect)]
enum PieceType {
    Tower,
    A,
    B,
    C
}



trait PieceTrait {
    fn new(id: u32, owner: felt252) -> Piece;
    fn check_move_valid(ref self: Piece,move: Vec2, next: Vec2) -> bool;
    fn check_next(ref self: Piece, next: Vec2) -> bool;

    fn get_moves(ref self: Piece) -> Array<Vec2>;

    fn is_available(ref self: Piece) -> bool;

    fn owner(ref self: Piece) -> felt252;
    fn update_location(ref self: Piece, location: felt252);
}

impl PieceImpl of PieceTrait {

    fn new(id: u32, owner: felt252) -> Piece {  
        let data = PieceData {owner, location: owner, position: Vec2 {x:0, y:0}, piece_type: PieceType::Tower}; 
        Piece {id, data}
    }

    fn check_next(ref self: Piece, next:Vec2) -> bool {
        let mut moves = self.get_moves();
        let mut valid = false;
        let position = self.data.position;
        
        let mut i=0;

        loop {
            if(i == moves.len()) {break;};

            let move: Vec2 = moves.pop_front().unwrap();
            
            let valid = self.check_move_valid(move, next);
            if(valid) {break;};

            i+=1;
        };

        valid
    }

    fn check_move_valid(ref self: Piece, move: Vec2, next: Vec2) -> bool {

        let position = self.data.position;

        let mut valid: bool = position.x + move.x == next.x && position.x + move.y == next.y;

        if(valid) {
            return valid;
        }

        valid = position.x - move.x == next.x && position.x - move.y == next.y;
        if(valid) {
            return valid;
        };    

        valid = position.x + move.x == next.x && position.x - move.y == next.y;
        if(valid) {
            return valid;
        };    
       
        valid = position.x - move.x == next.x && position.x + move.y == next.y;
        valid
}

    fn get_moves(ref self: Piece) -> Array<Vec2> {
        
        let mut res = ArrayTrait::new();
        
        match self.data.piece_type {
            PieceType::Tower => {
                res.append( Vec2 {x:1, y:1} );     
                res.append( Vec2 {x:1, y:0} );                 
                res.append( Vec2 {x:0, y:1} );                  
            },
            PieceType::A => {
                res.append( Vec2 {x:1, y:0});
            },
            PieceType::B => {
                res.append( Vec2 {x:0, y:1});
            },
            PieceType::C => {
                res.append( Vec2 {x:1, y:1} )
            }
        };

        res
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


