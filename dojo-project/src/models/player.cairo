use starknet::ContractAddress;
use project::models::piece::{Piece, PieceImpl};


#[derive(Model, Drop, Serde)]
struct Secret {
    #[key]
    player: ContractAddress,
    value: u8
}

#[derive(Model, Drop, Serde)]
struct Player {
    #[key]
    address: ContractAddress,
    games_count: u32,
    pieces_count: u32,
    team_count: u32
}

#[derive(Model, Drop, Serde)]
struct Team {
    #[key]
    owner: ContractAddress,
    #[key]
    index: u32,
    piece_1: Piece,
    piece_2: Piece,
    piece_3: Piece,
    piece_4: Piece

}

trait TeamTrait {
    fn check_available(self: @Team) -> bool;
}

impl TeamImpl of TeamTrait{

    fn check_available(self: @Team) -> bool {
        if (self.piece_1.check_available()){
            return false;
        }
        if(!self.piece_2.check_available()){
            return false;
        }
        if(!self.piece_3.check_available()){
            return false;
        }
        if(!self.piece_4.check_available()){
            return false;
        }

        return true;

    }
}



