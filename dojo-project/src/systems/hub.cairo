#[starknet::interface]
trait IHub <TContractState>{

    fn new_player(self: @TContractState, name:felt252);

}


#[dojo::contract]
mod hub {
    use starknet::{ContractAddress, get_caller_address};
    use project::models::player::{Player, PlayerTrait};
    use project::models::manager::{Manager, ManagerTrait, PlayerCount};
    use super::IHub;

    #[external(v0)]
    impl HubImpl of IHub<ContractState>{

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
