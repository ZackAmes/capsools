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
   cur_hp: u32,
   piece_type: u32
}

#[derive(Model, Drop, Serde)]
struct PieceType {
    #[key]
    id: u32,
    piece_stats: PieceStats
}

#[generate_trait]
impl PieceTypeImpl of PieceTypeTrait {
    fn new(id: u32, piece_stats: PieceStats) -> PieceType {
        PieceType {id, piece_stats}
    }
}

#[derive(Copy, Drop, Serde, Introspect)]
struct PieceStats{
    hp: u32,
    xp: u32,
    cost: u32,
    dmg: u32
//    moves: Span<Vec2>,
//    attacks: Span<Vec2>
}

#[generate_trait]
impl PieceStatsImpl of PieceStatsTrait {
    fn new(hp: u32, cost: u32, dmg: u32) -> PieceStats{
        
        PieceStats {hp, xp:0, cost, dmg}
    }
}



trait PieceTrait {

    fn new(id: u32, owner: felt252, cur_hp: u32, piece_type: u32) -> Piece;

    fn available(ref self: Piece) -> bool;

    fn move(ref self: Piece, next: Vec2);

    fn to_game(ref self: Piece, game_id: felt252, init_position: Vec2);

}

impl PieceImpl of PieceTrait {

    fn new(id: u32, owner: felt252, cur_hp: u32, piece_type: u32) -> Piece {  
        let data = PieceData {owner, location: owner, cur_hp,  position: Vec2 {x:0, y:0}, piece_type}; 
        Piece {id, data}
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


