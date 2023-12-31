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

trait PieceTypeTrait {
    fn get_moves(ref self: PieceType) -> Array<Vec2>;
}

impl RedImpl of PieceTypeTrait {
    fn get_moves(ref self: PieceType) -> Array<Vec2> {

        let mut res = ArrayTrait::new();
        
        res.append(Vec2 {x:1, y:0});
        res.append(Vec2 {x:2, y:0});

        res
    }
}

impl BlueImpl of PieceTypeTrait {
    fn get_moves(ref self: PieceType) -> Array<Vec2> {
        let mut res = ArrayTrait::new();
        
        res.append(Vec2 {x:1, y:1});
        res.append(Vec2 {x:2, y:0});

        res
    }
}

#[derive(Copy, Drop, Serde, Introspect)]
enum Colors {
    Red: PieceType,
    Blue: PieceType
}

trait PieceTrait {

    fn new(id: u32, owner: felt252, piece_type: PieceType) -> Piece;
    fn get_moves(ref self: Piece) -> Array<Vec2>;

    fn available(ref self: Piece) -> bool;

    fn get_type(ref self: Piece) -> PieceType;

    fn move(ref self: Piece, next: Vec2);

    fn to_game(ref self: Piece, game_id: felt252, init_position: Vec2);


}

impl PieceImpl of PieceTrait {

    fn new(id: u32, owner: felt252, piece_type: PieceType) -> Piece {  
        let data = PieceData {owner, location: owner, position: Vec2 {x:0, y:0}, piece_type}; 
        Piece {id, data}
    }

    fn get_moves(ref self: Piece) -> Array<Vec2> {
        
        let mut res = ArrayTrait::new();
        let piece_type = self.get_type();
        
        match piece_type {
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

    fn get_type(ref self: Piece) -> PieceType {

        self.data.piece_type
    }

    fn available(ref self: Piece) -> bool {
        return self.data.location == self.data.owner;
    }

    fn to_game(ref self: Piece, game_id: felt252, init_position: Vec2) {
        assert(!self.available(), 'piece not available');
        


        let mut data = self.data;
        data.location = game_id;
        data.position = init_position;

        self.data = data;
        
    }


    fn move(ref self: Piece, next: Vec2) {



    }

    
}


