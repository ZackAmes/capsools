use project::models::piece::{Piece, PieceTrait};
use starknet::{ContractAddress};

#[derive(Model, Drop, Serde, Copy)]
struct Team {
    #[key]
    id: u32,
    owner: felt252,
    location: felt252,
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

    fn new_from(tower: u32, piece_one: u32, piece_two:u32, piece_three: u32, piece_four: u32, piece_five: u32) -> Pieces {
        Pieces {tower, piece_one, piece_two, piece_three, piece_four, piece_five}
    }

    fn get_pieces(ref self: Pieces) -> Array<u32> {
        let mut res: Array<u32> = ArrayTrait::new();
        res.append(self.tower);
        res.append(self.piece_one);
        res.append(self.piece_three);
        res.append(self.piece_four);
        res.append(self.piece_five);
        return res;
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
    fn available(self: Team) -> bool;

    fn add_piece(ref self: Team, piece_id: u32);
    fn remove_piece(ref self: Team, id: u32);

    fn can_add(self: Team) -> bool;
    fn contains(self: Team, piece_id: u32) -> bool;

}

impl TeamImpl of TeamTrait {

    fn new(id: u32, owner: felt252) -> Team {
        let pieces = PiecesTrait::new();
        Team {id, owner, location:owner, piece_count:0, pieces}
<<<<<<< HEAD
    }

    fn available(self: Team) -> bool {
        self.location == self.owner
=======
>>>>>>> main
    }

    fn add_piece(ref self: Team, piece_id: u32) {
        assert(self.can_add(), 'team full');
        
        self.pieces.update_piece_at(self.piece_count, piece_id);
        self.piece_count+=1;
    }

    fn remove_piece(ref self: Team, id: u32) {


        assert(self.piece_count > 0, 'team empty');

        let mut count = self.piece_count;
        let mut temp_id = self.pieces.get_piece_at(count - 1);

        let mut index = 0;
        loop {
            if(index == count) {break;};

            let piece = self.pieces.get_piece_at(index);

            if(piece == id){
                self.pieces.update_piece_at(index, temp_id);
                self.pieces.update_piece_at(count-1, 0);
                self.piece_count -= 1;
                break;
            }
            
            index+=1;
        }

    }

    fn can_add(self: Team) -> bool {
        self.piece_count < 6
    }

    fn contains(self: Team, piece_id: u32) -> bool {
        assert(piece_id != 0, 'piece id cannot be 0');
        self.pieces.piece_one == piece_id || self.pieces.piece_two == piece_id
        
    }


}