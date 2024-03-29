#[starknet::interface]
trait IGenshin <TContractState>{

    fn mint_piece(self: @TContractState);
}

#[dojo::contract]
mod genshin {   

    use super::IGenshin;

    use starknet::{ContractAddress, get_caller_address};    
    use project::models::piece::{Piece, PieceTrait, PieceType};
    use project::models::player::{Player, PlayerTrait};
    use project::models::manager::{Manager, ManagerTrait, SetManager};

    #[abi(embed_v0)]
    impl GenshinImpl of IGenshin<ContractState> {

        fn mint_piece(self: @ContractState) {

            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();
            let set = get!(world, 0, (SetManager));
            assert(set.piece_type_count > 0, 'must spawn');

            let mut player = get!(world, caller, (Player));
            assert(!(player.name == ''), 'new player must init');
            let count = player.counts.piece_count;

            let type_index = count % set.piece_type_count;

            let type_id = get!(world, (0,4,type_index), (Manager)).id;
            let stats = get!(world, type_id, (PieceType)).piece_stats;

            let piece = PieceTrait::new(world.uuid(), caller, stats.base_hp, stats);
            let manager = ManagerTrait::piece(caller, count, piece.id);
            player.counts.piece_count +=1;
            player.points += 100;

            set!(world,(piece, manager, player));



        }
    }


}
