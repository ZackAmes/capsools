use starknet::{ContractAddress};
use project::models::piece::{PieceType};

#[starknet::interface]
trait IActions<TContractState> {
    fn spawn(self: @TContractState);
    fn set_secret(self: @TContractState, value: u8);
    fn take_turn(self: @TContractState, game_id: u32, x:u8, y:u8);
    fn challenge(self: @TContractState, player_two: ContractAddress);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use starknet::{ContractAddress, get_caller_address};
    use project::models::player::{Secret,  Player, Team};
    use project::models::game::{Game, Square,GameManager, Vec2};
    use project::models::piece::{Piece, PieceManager, PieceType};
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
                    Player {address: caller, games_count:1, pieces_count: 0, team_count: 0},
                    GameManager {player: caller, index: 0, game_id},
                    Game {game_id, player_one:caller, player_two:caller, ones_turn: true},
                )
            );

            self.create_squares(game_id, 3);

            self.create_pieces(caller);

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

            assert(square.state == 0, 'square taken');

            if(game.ones_turn){
                assert(player == game.player_one, 'not turn player, ones turn');
                square.state = 1;
                game.ones_turn = false;

            }
            else {
                assert(player == game.player_two, 'not turn player, twos turn');
                square.state = 2;
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
                )
            );

            self.create_squares(game_id, 3);
            self.create_pieces(player_one);

            one.games_count += 1;
            two.games_count +=1;

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

        fn create_pieces(self: @ContractState, owner: ContractAddress) {
            let world = self.world_dispatcher.read();
           
            let id_1 = world.uuid();
            let piece_1 = Piece {piece_id: id_1, owner, location: owner, piece_type: PieceType::X};

            let id_2 = world.uuid();
            let piece_2 = Piece {piece_id: id_2, owner, location: owner, piece_type: PieceType::X};

            let id_3 = world.uuid();
            let piece_3 = Piece {piece_id: id_3, owner, location: owner, piece_type: PieceType::X};

            let id_4= world.uuid();
            let piece_4 = Piece {piece_id: id_4, owner, location: owner, piece_type: PieceType::X};

            set!(world, (piece_1, piece_2, piece_3, piece_4));

        }

        fn create_team(self: @ContractState, owner: ContractAddress, id_1: u32, id_2: u32, id_3: u32, id_4:u32) {
            let world = self.world_dispatcher.read();

            let piece_1 = get!(world, id_1, (Piece));   
            let piece_2 = get!(world, id_2, (Piece));   
            let piece_3 = get!(world, id_3, (Piece));   
            let piece_4 = get!(world, id_4, (Piece));           

            let team = Team {owner, index: 0, piece_1, piece_2, piece_3, piece_4};

            set!(world, (team));         
            
        }

        fn create_piece(self: @ContractState, piece_type: PieceType) {
            let world = self.world_dispatcher.read();
            let owner = get_caller_address();
            let piece_id = world.uuid();
            let mut player = get!(world, owner, (Player));
            let index = player.pieces_count;
            player.pieces_count += 1;
            
            set!(world, 
                    (
                        PieceManager {owner, index, piece_id},
                        Piece {piece_id, owner, location: owner, piece_type},
                        player
                    )
                )
        }

        
    }
}
