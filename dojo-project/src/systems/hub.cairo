#[starknet::interface]
trait IHub <TContractState>{

    fn spawn(self: @TContractState);
    fn new_player(self: @TContractState, name:felt252);

}


#[dojo::contract]
mod hub {
    use starknet::{ContractAddress, get_caller_address};
    use project::models::player::{Player, PlayerTrait};
    use project::models::piece::{Piece, PieceTrait, PieceTypeTrait, PieceStatsTrait};
    use project::models::manager::{Manager, ManagerTrait, PlayerCount, SetManager};
    use project::models::game::{Vec2};

    use super::IHub;

    #[external(v0)]
    impl HubImpl of IHub<ContractState>{

        fn spawn(self: @ContractState) {
            
            let world = self.world_dispatcher.read();
            let mut set_zero = get!(world, 0 , (SetManager));

            assert(set_zero.piece_type_count == 0, 'already spawned');
            let mut ma = ArrayTrait::new();
            ma.append( Vec2{x:1, y:0});
            
            let type_zero_stats = PieceStatsTrait::new(500, 100, 100);
            let type_zero = PieceTypeTrait::new(world.uuid(), type_zero_stats);
            let type_manager = ManagerTrait::piece_type(set_zero.set_id, set_zero.piece_type_count, type_zero.id);

            set_zero.piece_type_count+=1;

            set!(world, (set_zero, type_zero, type_manager));




        }

        fn new_player(self: @ContractState, name: felt252) {

            assert(!(name == ''), 'name must not be empty');

            let world = self.world_dispatcher.read();

            let world_address = world.executor().into();

            let caller = get_caller_address().into();
            let mut player = get!(world, caller, (Player));

            assert(player.name == '', 'player already created');

            let mut count = get!(world, world_address, (PlayerCount));
            player = PlayerTrait::new(caller, name, 1000);
            let manager = ManagerTrait::player(world_address, count.count, caller);
            count.count+=1;

            set!(world, (player, manager, count))


        }
    }

}
