#[starknet::interface]
trait IHub <TContractState>{

    fn spawn(self: @TContractState);
    fn new_player(self: @TContractState, name:felt252);

}


#[dojo::contract]
mod hub {
    use starknet::{ContractAddress, get_caller_address};
    use project::models::player::{Player, PlayerTrait};
    use project::models::piece::{Piece, PieceTrait, PieceTypeTrait, PieceStatsTrait, Color};
    use project::models::manager::{Manager, ManagerTrait, PlayerCount, SetManager};
    use project::models::game::{Vec2};

    use super::IHub;

    #[abi(embed_v0)]
    impl HubImpl of IHub<ContractState>{

        fn spawn(self: @ContractState) {
            
            let world = self.world_dispatcher.read();
            let mut set_zero = get!(world, 0 , (SetManager));

            assert(set_zero.piece_type_count == 0, 'already spawned');
            let mut ma = ArrayTrait::new();
            ma.append( Vec2{x:1, y:0});
            
            let type_zero_stats = PieceStatsTrait::new(500, 100, 100, true, Color::Black);
            let type_one_stats = PieceStatsTrait::new(600, 125, 75, false, Color::Blue);
            let type_two_stats = PieceStatsTrait::new(750, 200, 200, false, Color::Green);
            let type_three_stats = PieceStatsTrait::new(400, 300, 250, false, Color::Red);

            let type_zero = PieceTypeTrait::new(world.uuid(), type_zero_stats);
            let type_one = PieceTypeTrait::new(world.uuid(), type_one_stats);
            let type_two = PieceTypeTrait::new(world.uuid(), type_two_stats);
            let type_three = PieceTypeTrait::new(world.uuid(), type_three_stats);


            let type_z_manager = ManagerTrait::piece_type(set_zero.set_id, set_zero.piece_type_count, type_zero.id);
            set_zero.piece_type_count+=1;

            let type_o_manager = ManagerTrait::piece_type(set_zero.set_id, set_zero.piece_type_count, type_one.id);
            set_zero.piece_type_count+=1;
            let type_tw_manager = ManagerTrait::piece_type(set_zero.set_id, set_zero.piece_type_count, type_two.id);
            set_zero.piece_type_count+=1;
            let type_th_manager = ManagerTrait::piece_type(set_zero.set_id, set_zero.piece_type_count, type_three.id);

            set_zero.piece_type_count+=1;

            set!(world, (set_zero, type_zero, type_one, type_two, type_three,
                                    type_o_manager, type_th_manager, type_tw_manager, type_z_manager));


        }

        fn new_player(self: @ContractState, name: felt252) {

            assert(!(name == ''), 'name must not be empty');

            let world = self.world_dispatcher.read();

            let world_address = 0;

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
