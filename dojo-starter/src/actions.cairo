
#[starknet::interface]
trait IActions<TContractState> {
    fn spawn(self: @TContractState);
    fn set_secret(self: @TContractState, value: u8);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use starknet::{ContractAddress, get_caller_address};
    use dojo_examples::models::{Secret, Game, Square};
    use super::IActions;

    
    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {
        // ContractState is defined by system decorator expansion
        fn spawn(self: @ContractState) {
            // Access the world dispatcher for reading.
            let world = self.world_dispatcher.read();

            // Get the address of the current caller, possibly the player's address.
            let caller = get_caller_address();

            
            set!(
                world,
                (
                    Secret {player: caller, value: 69},
                    Game {game_id: 0, ones_turn: true},
                    Square {game_id: 0, x:0, y:0, value:0},
                    Square {game_id: 0, x:1, y:0, value:0},
                    Square {game_id: 0, x:2, y:0, value:0},
                    Square {game_id: 0, x:0, y:1, value:0},
                    Square {game_id: 0, x:1, y:1, value:0},
                    Square {game_id: 0, x:2, y:1, value:0},
                    Square {game_id: 0, x:0, y:2, value:0},
                    Square {game_id: 0, x:1, y:2, value:0},
                    Square {game_id: 0, x:2, y:2, value:0},
                )
            );
        }

        // Implementation of the move function for the ContractState struct.
        fn set_secret(self: @ContractState, value: u8) {
            // Access the world dispatcher for reading.
            let world = self.world_dispatcher.read();

            // Get the address of the current caller, possibly the player's address.
            let player = get_caller_address();

            set!(world, Secret {player, value});
        }
    }
}
