use project::models::piece::{Piece, PieceTrait};
use starknet::{ContractAddress};

#[derive(Model, Drop, Serde)]
struct Team {
    #[key]
    id: u32,
    owner: felt252,
    piece_count: u8,
    pieces: Pieces
}

#[derive(Copy, Drop, Serde, Introspect)]
struct Pieces {
    tower: u32,
    piece_one: u32,
    piece_two: u32,
    piece_three: u32,
    piece_four: u32,
    piece_five: u32
}

#[generate_trait]
impl PiecesImpl of PiecesTrait {
    fn new() -> Pieces {
        Pieces {tower:0, piece_one:0, piece_two:0, piece_three:0, piece_four:0, piece_five:0}
    }
    fn get_piece_at(ref self: Pieces, index: u8) -> u32 {
        if(index==0){
            return self.tower;    
        }
        if(index==1){
            return self.piece_one;  
        }
        if(index==2){
            return self.piece_two;    
        }
        if(index==3){
            return self.piece_three;    
        }
        if(index==4){
            return self.piece_four;    
        }
        if(index==5){
            return self.piece_five;    
        }
        else {
            0
        }
    } 

    fn update_piece_at(ref self: Pieces, index: u8, new_id: u32) {
        if(index==0){
            self.tower = new_id;   
        }
        if(index==1){
            self.piece_one = new_id;
        }
        if(index==2){
            self.piece_two = new_id;
        }
        if(index==3){
            self.piece_three = new_id;   
        }
        if(index==4){
            self.piece_four = new_id;
        }
        if(index==5){
            self.piece_five = new_id;
        }
    }


}

trait TeamTrait {
    fn new(id: u32, owner: felt252) -> Team;

    fn add_piece(ref self: Team, piece_id: u32);
    fn remove_piece(ref self: Team, index: u8);

    fn can_add(ref self: Team) -> bool;
    fn contains(ref self: Team, piece_id: u32) -> bool;

}

impl TeamImpl of TeamTrait {

    fn new(id: u32, owner: felt252) -> Team {
        let pieces = PiecesTrait::new();
        Team {id, owner, piece_count:0, pieces}
    }

    fn add_piece(ref self: Team, piece_id: u32) {
        assert(self.can_add(), 'team full');
        
        self.pieces.update_piece_at(self.piece_count, piece_id);
        self.piece_count+=1;
    }

    fn remove_piece(ref self: Team, index: u8) {


        let mut pieces = self.pieces;
        let count = self.piece_count;

        assert(index < count, 'invalid index');
        if index == count-1 {
            pieces.update_piece_at(index, 0);
        }
        else {
            let temp = pieces.get_piece_at(count-1);
            pieces.update_piece_at(count-1, 0);
            pieces.update_piece_at(index, temp);
        }
        self.pieces = pieces;
        self.piece_count = count - 1;

    }

    fn can_add(ref self: Team) -> bool {
        self.piece_count < 5
    }

    fn contains(ref self: Team, piece_id: u32) -> bool {
        assert(piece_id != 0, 'piece id cannot be 0');
        self.pieces.piece_one == piece_id || self.pieces.piece_two == piece_id
        
    }


}