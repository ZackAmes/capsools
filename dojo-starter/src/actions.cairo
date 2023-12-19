use starknet::{ContractAddress};

#[starknet::interface]
trait IActions<TContractState> {
    fn spawn(self: @TContractState);
    fn set_secret(self: @TContractState, value: u8);
    fn take_turn(self: @TContractState, game_id: u32, x:u8, y:u8);
    fn challenge(self: @TContractState, player_two: ContractAddress);
    fn create_piece(self: @TContractState, piece_type: u8, owner: ContractAddress);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use starknet::{ContractAddress, get_caller_address};
    use project::models::player::{Secret,  Player};
    use project::models::game::{Game, Square,GameManager};
    use project::models::piece::{Piece, PieceManager};
    use super::IActions;

    
    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {
        // ContractState is defined by system decorator expansion
        fn spawn(self: @ContractState) {
            // Access the world dispatcher for reading.
            let world = self.world_dispatcher.read();

            // Get the address of the current caller, possibly the player's address.
            let caller = get_caller_address();

            let game_id = world.uuid();
            
            set!(
                world,
                (
                    Secret {player: caller, value: 69},
                    Player {address: caller, games_count:1, pieces_count: 0},
                    GameManager {player: caller, index: 0, game_id},
                    Game {game_id, player_one:caller, player_two:caller, ones_turn: true},
                    Square {game_id, x:0, y:0, value:0},
                    Square {game_id, x:1, y:0, value:0},
                    Square {game_id, x:2, y:0, value:0},
                    Square {game_id, x:0, y:1, value:0},
                    Square {game_id, x:1, y:1, value:0},
                    Square {game_id, x:2, y:1, value:0},
                    Square {game_id, x:0, y:2, value:0},
                    Square {game_id, x:1, y:2, value:0},
                    Square {game_id, x:2, y:2, value:0},
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

        fn take_turn(self: @ContractState, game_id: u32, x:u8, y:u8){
            let world = self.world_dispatcher.read();

            let player = get_caller_address();

            let mut game = get!(world, game_id, (Game));

            let mut square = get!(world, (game_id, x, y), (Square));

            assert(square.value == 0, 'square taken');

            if(game.ones_turn){
                assert(player == game.player_one, 'not turn player, ones turn');
                square.value = 1;
                game.ones_turn = false;

            }
            else {
                assert(player == game.player_two, 'not turn player, twos turn');
                square.value = 2;
                game.ones_turn = true;
            }

            set!(world, (game, square))
        }

        fn challenge(self: @ContractState, player_two: ContractAddress) {

            let world = self.world_dispatcher.read();

            let player_one = get_caller_address();

            let mut one = get!(world, player_one, (Player));
            let mut two = get!(world, player_two, (Player));

            assert(one.games_count > 0, 'player one must spawn');
            assert(two.games_count > 0, 'player two must spawn');

            let game_id = world.uuid();


            set!(
                world,
                (
                    GameManager {player: player_one, index: one.games_count, game_id},
                    GameManager {player: player_two, index: two.games_count, game_id},
                    Game {game_id, player_one, player_two, ones_turn: true},
                    Square {game_id, x:0, y:0, value:0},
                    Square {game_id, x:1, y:0, value:0},
                    Square {game_id, x:2, y:0, value:0},
                    Square {game_id, x:0, y:1, value:0},
                    Square {game_id, x:1, y:1, value:0},
                    Square {game_id, x:2, y:1, value:0},
                    Square {game_id, x:0, y:2, value:0},
                    Square {game_id, x:1, y:2, value:0},
                    Square {game_id, x:2, y:2, value:0},
                )
            );

            one.games_count += 1;
            two.games_count +=1;

            set!(world, (one,two));
        }

        fn create_piece(self: @ContractState, piece_type: u8, owner: ContractAddress) {
            let world = self.world_dispatcher.read();
            let piece_id = world.uuid();
            let index = get!(world, owner, (Player)).pieces_count;
            set!(world, 
                    (
                        PieceManager {owner, index, piece_id},
                        Piece {piece_id, owner, location: owner, piece_type},
                    )
                )
        }        

    }
}
