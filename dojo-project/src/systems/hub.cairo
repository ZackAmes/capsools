#[starknet::interface]
trait IHub <TContractState>{

    fn new_player(self: @TContractState, name:felt252);

}


#[dojo::contract]
mod Hub {
    use starknet::{ContractAddress, get_caller_address};
    use project::models::player::{Player, PlayerTrait};
    use project::models::manager::{Manager, ManagerTrait, PlayerCount};
    use super::IHub;


    impl IHubImpl of IHub<ContractState>{

        fn new_player(self: @ContractState, name: felt252) {

            assert(!(name == ''), 'name must not be empty');

            let world = self.world_dispatcher.read();

            let world_address = world.executor().into();

            let caller = get_caller_address().into();
            let mut player = get!(world, caller, (Player));

            assert(player.name == '', 'player already created');

            let mut count = get!(world, world_address, (PlayerCount)).count;
            player = PlayerTrait::new(caller, name, 1000);
            let manager = ManagerTrait::player(world_address, count, caller);


        }
    }

}
