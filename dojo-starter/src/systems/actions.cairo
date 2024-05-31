use dojo_starter::models::position::{Vec2};
// define the interface
#[dojo::interface]
trait IActions {
    fn spawn();
    fn move(next: Vec2);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use super::{IActions};
    use starknet::{ContractAddress, get_caller_address};
    use dojo_starter::models::{piece::{Piece}, game:{Game, Move, Action, ActionType}, team: Team, position::{Tile, Vec2}, moves::{Moves, MovesTrait}};

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn spawn(world: IWorldDispatcher) {
            // Get the address of the current caller, possibly the player's address.
            let player = get_caller_address();
        }

        // Implementation of the move function for the ContractState struct.
        fn move(world: IWorldDispatcher, next: Vec2) {
            // Get the address of the current caller, possibly the player's address.
            let player = get_caller_address();

    
        }
    }
}
