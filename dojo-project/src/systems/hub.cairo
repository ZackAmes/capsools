use starknet::{ContractAddress};

#[starknet::interface]
trait IHub<TContractState>{
    fn new_player(self: @TContractState, name: felt252);
}

#[dojo::contract]
mod Hub {

    use super::IHub;
    use project::models::player::{Player, PlayerTrait};


    impl HubImpl of IHub {
        fn new_player(self: @TContractState, name: felt252) {
            let world = self.world_dispatcher.read();
            let caller = get_caller_address();
            let mut player = get!(world, caller, (Player));

            assert(player.name.is_zero(), 'Player already created');

            player = PlayerTrait::new(caller, name);
            set!(world, player);

        }
    }
}