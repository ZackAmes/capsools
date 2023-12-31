#[starknet::interface]
trait IGenshin <TContractState>{

    fn mint_piece(self: @TContractState);
}

#[dojo::contract]
mod genshin {   

    use super::IGenshin;

    use starknet::{ContractAddress, get_caller_address};    
    use project::models::piece::{Piece, PieceTrait, PieceType, Color};
    use project::models::player::{Player, PlayerTrait};
    use project::models::manager::{Manager, ManagerTrait};

    #[external(v0)]
    impl GenshinImpl of IGenshin<ContractState> {

        fn mint_piece(self: @ContractState) {

            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();

            let mut player = get!(world, caller, (Player));
            assert(!(player.name == ''), 'new player must init');
            let count = player.counts.piece_count;
            let piece_type = get_piece_type(count);
            let color = Color::Red(piece_type);
            let piece = PieceTrait::new(world.uuid(), caller, color);
            let manager = ManagerTrait::piece(caller, count, piece.id);
            player.counts.piece_count+=1;

            set!(world, (player, piece, manager));



        }
    }

    //TODO: make random?
    fn get_piece_type(number: u32) -> PieceType {
        let piece = number % 4;

        if(piece == 0) {
            return PieceType::Tower;
        }
        if(piece == 1) {
            return PieceType::A;
        }
        if(piece == 2) {
            return PieceType::B;
        }
        else {
            return PieceType::C;
        }

    }


}