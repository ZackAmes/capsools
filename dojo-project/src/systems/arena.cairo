#[starknet::interface]
trait IArena<TContractState> {
    fn create_challenge(self: @TContractState, team_id: u32);
    fn accept_challenge(self: @TContractState, game_id: u32, team_id: u32);
}

#[dojo::contract]
mod arena {
    use project::models::team::{Team, Pieces};
    use project::models::game::{Game, GameTrait, Vec2};
    use project::models::piece::{Piece, PieceImpl, PieceTrait};
    use project::models::player::{Player};
    use project::models::manager::{Manager, ManagerTrait, SetManager};
    use starknet::{get_caller_address};
    use super::IArena;

    #[external(v0)]
    impl ArenaImpl of IArena<ContractState> {
        fn create_challenge(self: @ContractState, team_id: u32){
            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();
            let mut set_manager = get!(world, 0, (SetManager));

            let team = get!(world, team_id, (Team));
            let mut player = get!(world, caller,(Player));
            assert(team.owner == caller, 'not team owner');

            let game = GameTrait::new(world.uuid(), team_id);
            let game_manager = ManagerTrait::game(caller, player.counts.game_count, game.id);
            let challenge_manager = ManagerTrait::challenge(0, set_manager.challenge_count, game.id);
            player.counts.game_count+=1;
            set_manager.challenge_count+=1;

            self.update_pieces_locations(team.pieces, game.id.into() , false);

            set!(world, (set_manager, game_manager, challenge_manager, player, team, game));
        }

        fn accept_challenge(self: @ContractState, game_id: u32, team_id: u32){
            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();

            let mut game = get!(world, game_id, (Game));
            let mut set_manager = get!(world, 0, (SetManager));

            assert(set_manager.challenge_count>0, 'no challenges');
            let mut i = 0;
            let mut challenge_manager = ManagerTrait::challenge(0,0,0);
            loop {
                if(i == set_manager.challenge_count) {break;};
                let temp_manager = get!(world, (0,5,i), (Manager));


                if( temp_manager.id == game.id.into() ) {
                    challenge_manager = temp_manager;                   
                    break;
                };
                i+=1;
            };

            assert(challenge_manager.id == game.id.into(), 'invalid challenge');

            let last_index = set_manager.challenge_count-1;
            let mut challenge_tomove = get!(world, (0,5,last_index), (Manager));
            

            let team_one = get!(world, game.data.team_one, (Team));
            let team_two = get!(world, team_id, (Team));


            assert(!(team_one.owner == caller), 'cant accept own challenge');
            assert(team_two.owner == caller, 'not team owner');


            let mut player = get!(world, caller,(Player));

            let manager = ManagerTrait::game(caller, player.counts.game_count, game.id);
            
            player.counts.game_count+=1;
            set_manager.challenge_count -=1;
            challenge_manager.id = challenge_tomove.id;
            challenge_tomove.id = 0;
            game.accept(team_two.id);
            self.update_pieces_locations(team_two.pieces, game.id.into() , true);

            set!(world, (game, player, manager, set_manager, challenge_manager, challenge_tomove));


        }
    }

    #[generate_trait]
    impl Private of PrivateTrait {
        fn get_pieces_array(self: @ContractState, pieces: Pieces) -> Span<Piece> {
            let world = self.world_dispatcher.read();
            let mut res: Array<Piece> = ArrayTrait::new();
            let tower = get!(world, pieces.tower, (Piece));
            let piece_one = get!(world, pieces.piece_one , (Piece));
            let piece_two = get!(world, pieces.piece_two , (Piece));
            let piece_three = get!(world, pieces.piece_three , (Piece));
            let piece_four = get!(world, pieces.piece_four , (Piece));
            let piece_five = get!(world, pieces.piece_five , (Piece));

            res.append(tower);
            res.append(piece_one);
            res.append(piece_two);
            res.append(piece_three);
            res.append(piece_four);
            res.append(piece_five);
            res.span()     

        }

        fn update_pieces_locations(self: @ContractState, pieces: Pieces, new_location: felt252, accepting: bool) {
            let world = self.world_dispatcher.read();
            let mut arr = self.get_pieces_array(pieces);
            let mut index = 0;
            loop {
                if(index == 6) {break;};
                let mut piece = *arr.get(index).unwrap().unbox();
                if(piece.id == 0) {break;};
                let mut new_position = piece.data.position;
                if(accepting){
                    new_position = Vec2 {x: new_position.x, y:12};
                }
                else{
                    new_position = piece.data.position;
                }


                piece.add_to(new_location, new_position);
                set!(world, (piece));
                index+=1;
            }
        }
    }
}