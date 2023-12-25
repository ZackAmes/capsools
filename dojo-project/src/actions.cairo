use starknet::{ContractAddress};

#[starknet::interface]
trait IActions<TContractState> {
    fn spawn(self: @TContractState);
    fn take_turn(self: @TContractState, game_id: u32, x:u8, y:u8);
    fn challenge(self: @TContractState, player_two: ContractAddress);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use starknet::{ContractAddress, get_caller_address};
    use project::models::player::{Player, PlayerTrait};
    use project::models::game::{Game, GameTrait, Square, Vec2};
    use project::models::piece::{Piece, PieceTrait};
    use project::models::manager::{Manager};

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

            let player = PlayerTrait::new(caller, 'test');
            let game = GameTrait::new(game_id, caller, caller);
            
            set!(
                world,
                (
                    player,
                    Manager {owner: caller, label:'game', index: 0, id: game_id},
                    game,
                )
            );

            self.create_squares(game_id, 3);

            self.create_piece(caller);


        }


        fn take_turn(self: @ContractState, game_id: u32, x:u8, y:u8){
            let world = self.world_dispatcher.read();

            let player = get_caller_address();

            let mut game = get!(world, game_id, (Game));

            let mut square = get!(world, (game_id, x, y), (Square));

            assert(square.state == 0, 'square taken');

            if(game.data.ones_turn){
                assert(player == game.data.team_one.player, 'not turn player, ones turn');
                square.state = 1;
                game.data.ones_turn = false;

            }
            else {
                assert(player == game.data.team_two.player, 'not turn player, twos turn');
                square.state = 2;
                game.data.ones_turn = true;
            }

            set!(world, (game, square))
        }

        fn challenge(self: @ContractState, player_two: ContractAddress) {

            let world = self.world_dispatcher.read();

            let player_one = get_caller_address();

            let mut one = get!(world, player_one, (Player));
            let mut two = get!(world, player_two, (Player));

            assert(one.games_count() > 0, 'player one must spawn');
            assert(two.games_count() > 0, 'player two must spawn');

            let game_id = world.uuid();
            let game = GameTrait::new(game_id, player_one, player_two);


            set!(
                world,
                (
                    Manager {owner: player_one, label: 'game', index: one.games_count(), id: game_id},
                    Manager {owner: player_two, label: 'game', index: two.games_count(), id: game_id},
                    game,
                )
            );

            self.create_squares(game_id, 3);

            one.increment_games();
            two.increment_games();

            set!(world, (one,two));
        }

        

    }

    #[generate_trait]
    impl Private of PrivateTrait {
        fn create_squares(self: @ContractState, game_id: u32, size: u8) {
            let world = self.world_dispatcher.read();

            let total = size * size;

            let mut index = 0;

            loop {
                if (index >= total) {break;}

                let x = index % size;
                let y = index/ size;

                let position = Vec2 {x, y};

                set!(world, Square {game_id, position , state: 0});

                index +=1;
            };
        }   

        fn create_piece(self: @ContractState, owner: ContractAddress) {
            let world = self.world_dispatcher.read();
            let piece_id = world.uuid();
            let mut player = get!(world, owner, (Player));
            let index = player.pieces_count();
            player.increment_pieces();

            let piece = PieceTrait::new(piece_id, owner);
            
            set!(world, 
                    (
                        Manager {owner, label:'pieces', index, id: piece_id},
                        piece,
                        player
                    )
                )
        }

        
    }
}
