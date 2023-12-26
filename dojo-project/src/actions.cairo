use starknet::{ContractAddress};

#[starknet::interface]
trait IActions<TContractState> {
    fn spawn(self: @TContractState);
    fn take_turn(self: @TContractState, game_id: u32, x:u8, y:u8);
    fn challenge(self: @TContractState, player_two: felt252);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use starknet::{ContractAddress, get_caller_address};
    use project::models::player::{Player, PlayerTrait};
    use project::models::game::{Game, GameTrait, Square, Vec2};
    use project::models::piece::{Piece, PieceTrait};
    use project::models::manager::{Manager, ManagerTrait};
    use project::models::team::{Team, TeamTrait};

    use super::IActions;

    
    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {
        // ContractState is defined by system decorator expansion
        fn spawn(self: @ContractState) {
            // Access the world dispatcher for reading.
            let world = self.world_dispatcher.read();

            // Get the address of the current caller, possibly the player's address.
            let caller = get_caller_address().into();

            let game_id = world.uuid();

            let player = PlayerTrait::new(caller, 'test');

            let piece_one = PieceTrait::new(world.uuid(), caller);
            let piece_two = PieceTrait::new(world.uuid(), caller);

            let mut team = TeamTrait::new(world.uuid(), caller);
            team.add_piece(piece_one.id);
            team.add_piece(piece_two.id);

            let game = GameTrait::new(game_id, team.id, team.id);
            let manager = ManagerTrait::game(caller, 0, game_id);
            
            set!(
                world,
                (
                    player,
                    manager,
                    game,
                )
            );

            self.create_squares(game_id, 3);

            self.create_team(caller, 2);


        }


        fn take_turn(self: @ContractState, game_id: u32, x:u8, y:u8){
            let world = self.world_dispatcher.read();

            let player = get_caller_address().into();

            let mut game = get!(world, game_id, (Game));

            let mut square = get!(world, (game_id, x, y), (Square));

            assert(square.state == 0, 'square taken');

            let team_one = get!(world, game.data.team_one, (Team));
            let team_two = get!(world, game.data.team_two, (Team));


            if(game.data.ones_turn){
                assert(player == team_one.owner, 'not turn player, ones turn');
                square.state = 1;
                game.data.ones_turn = false;

            }
            else {
                assert(player == team_two.owner, 'not turn player, twos turn');
                square.state = 2;
                game.data.ones_turn = true;
            }

            set!(world, (game, square))
        }

        fn challenge(self: @ContractState, player_two: felt252) {

            let world = self.world_dispatcher.read();

            let player_one = get_caller_address().into();

            let mut one = get!(world, player_one, (Player));
            let mut two = get!(world, player_two, (Player));

            assert(one.game_count() > 0, 'player one must spawn');
            assert(two.game_count() > 0, 'player two must spawn');

            let game_id = world.uuid();

            let team_one = self.create_team(player_one, 2);
            let team_two = self.create_team(player_two, 2);

            

            
            let game = GameTrait::new(game_id, team_one, team_two);

            let one_manager = ManagerTrait::game(player_one, one.game_count(), game_id);
            let two_manager = ManagerTrait::game(player_two, one.game_count(), game_id);


            set!( world, (game, one_manager, two_manager));

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

        fn create_team(self: @ContractState, owner: felt252, amt: u8) -> u32 {
            
            assert (amt == 2, 'only teams of 2 atm');
            let world = self.world_dispatcher.read();

            let mut player = get!(world, owner, (Player));
            let mut team = TeamTrait::new(world.uuid(), owner);

            let mut i = 0;
            loop{
                if(i == amt) {break;};

                let index = player.piece_count();
                player.increment_pieces();

                let piece = PieceTrait::new(world.uuid(), owner);
                let manager = ManagerTrait::piece(owner, index, piece.id);

                team.add_piece(piece.id);
                
                set!(world, (manager,piece));

                i+=1;    
            };

            let id = team.id;

            set!(world, (team, player));        

            id

        }

        fn add_piece_to_team(self: @ContractState, owner: felt252, piece_id: u32, team_id: u32) {

            let world = self.world_dispatcher.read();

            let mut player = get!(world, owner, (Player));
            let mut piece = get!(world, piece_id, (Piece));
            let mut team = get!(world, team_id, (Team));

            assert(piece.is_available(), 'piece not available');

            piece.update_location(team_id.into());
            
            team.add_piece(piece_id);
            

            set!(world, (team, piece));



        }

        
    }
}
