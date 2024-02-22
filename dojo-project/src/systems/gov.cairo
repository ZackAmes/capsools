#[starknet::interface]
trait IGov <TContractState> {
    fn buff(self: @TContractState, type_id: u32);
    fn nerf(self: @TContractState, type_id: u32);
    fn add_piece(self: @TContractState);
}

#[dojo::contract]
mod gov {
    use starknet::{get_caller_address};
    use super::IGov;
    use project::models::player::{Player};
    use project::models::manager::{SetManager};
    use project::models::piece::{PieceStatsTrait, PieceType};

    #[abi(embed_v0)]
    impl GovImpl of IGov<ContractState> {
        fn buff(self: @ContractState, type_id: u32) {

            let world = self.world_dispatcher.read();
            let set = get!(world, 0, (SetManager));

            assert(type_id < set.piece_type_count, 'invalid type');

            let caller:felt252 = get_caller_address().into();
            let mut player = get!(world, caller, (Player));

            assert(player.points > 100, 'not enough points');
            player.points -= 100;

            let mut piece_type = get!(world, type_id, (PieceType));
            piece_type.piece_stats.dmg = (piece_type.piece_stats.dmg * 110)/ 100;

            set!(world, (piece_type, player));

        }

        fn nerf(self: @ContractState, type_id: u32) {

            let world = self.world_dispatcher.read();
            let set = get!(world, 0, (SetManager));

            assert(type_id < set.piece_type_count, 'invalid type');

            let caller:felt252 = get_caller_address().into();
            let mut player = get!(world, caller, (Player));

            assert(player.points > 100, 'not enough points');
            player.points -= 100;

            let mut piece_type = get!(world, type_id, (PieceType));
            piece_type.piece_stats.dmg = (piece_type.piece_stats.dmg * 90) / 100;

            set!(world, (piece_type, player));

        }

        fn add_piece(self: @ContractState) {

            let world = self.world_dispatcher.read();
            let mut set = get!(world, 0, (SetManager));

            let caller:felt252 = get_caller_address().into();
            let mut player = get!(world, caller, (Player));

            assert(player.points > 1000, 'not enough points');
            player.points -= 1000;

            let piece_stats = PieceStatsTrait::new(1000,1000,1000);

            let new_type = PieceType {id: set.piece_type_count, piece_stats};
            set.piece_type_count+=1;

            set!(world, (set, new_type, player));

        }

    }
}