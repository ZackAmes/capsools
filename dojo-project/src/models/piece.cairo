use project::models::game::{Vec2};
use starknet::OptionTrait;

#[derive(Copy, Drop, Serde, Introspect, PartialEq)]
enum Color {
    Red,
    Green,
    Blue,
    White,
    Black,
    None
}

#[derive(Model, Drop, Serde, Copy)]
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
   cur_hp: u32,
   base_stats: PieceStats,
   xp: u32,
}

#[derive(Model, Drop, Serde)]
struct PieceType {
    #[key]
    id: u32,
    piece_stats: PieceStats
}

#[generate_trait]
impl PieceTypeImpl of PieceTypeTrait {
    fn new(piece_stats: PieceStats) -> PieceType {
        PieceType {id: piece_stats.type_id, piece_stats}
    }
}

#[derive(Copy, Drop, Serde, Introspect)]
struct PieceStats{
    name: felt252,
    type_id: u32,
    base_hp: u32,
    cost: u32,
    dmg: u32,
    is_tower: bool,
    color: Color

//    moves: Span<Vec2>,
//    attacks: Span<Vec2>
}

#[generate_trait]
impl PieceStatsImpl of PieceStatsTrait {
    fn new(type_id:u32, base_hp: u32, cost: u32, dmg: u32, is_tower: bool, color: Color) -> PieceStats{
        
        PieceStats {type_id, name: 'placeholder', base_hp, cost, dmg, is_tower, color}
    }
}



trait PieceTrait {

    fn new(id: u32, owner: felt252, cur_hp: u32, base_stats: PieceStats) -> Piece;

    fn available(ref self: Piece) -> bool;

    fn move(ref self: Piece, next: Vec2);

    fn add_to(ref self: Piece, id: felt252, init_position: Vec2);

}

impl PieceImpl of PieceTrait {

    fn new(id: u32, owner: felt252, cur_hp: u32, base_stats: PieceStats) -> Piece {  
        let data = PieceData {owner, location: owner,xp:0, cur_hp,  position: Vec2 {x:0, y:0}, base_stats}; 
        Piece {id, data}
    }

    fn available(ref self: Piece) -> bool {
        return self.data.location == self.data.owner;
    }

    fn add_to(ref self: Piece, id: felt252, init_position: Vec2) {
        assert(self.available(), 'piece not available');
        
        let mut data = self.data;
        data.location = id;
        data.position = init_position;

        self.data = data;
        
    }

    fn move(ref self: Piece, next: Vec2) {

    }
    
}


