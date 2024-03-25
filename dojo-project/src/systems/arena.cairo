#[starknet::interface]
trait IArena<TContractState> {
    fn create_challenge(self: @TContractState, team_id: u32);
    fn accept_challenge(self: @TContractState, game_id: u32, team_id: u32);
    fn take_turn(self: @TContractState, game_id: u32, piece_id: u32, x: u8, y: u8);
}

#[dojo::contract]
mod arena {
    use project::models::team::{Team,TeamTrait, Pieces};
    use project::models::game::{Game, GameTrait, Vec2, Vec2Trait};
    use project::models::piece::{Piece, PieceImpl, PieceTrait};
    use project::models::player::{Player};
    use project::models::manager::{Manager, ManagerTrait, SetManager};
    use starknet::{get_caller_address};
    use super::IArena;

    #[abi(embed_v0)]
    impl ArenaImpl of IArena<ContractState> {
        fn create_challenge(self: @ContractState, team_id: u32){
            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();
            let mut set_manager = get!(world, 0, (SetManager));

            let mut team = get!(world, team_id, (Team));
            let mut player = get!(world, caller,(Player));
            assert(team.owner == caller, 'not team owner');
            assert(team.valid(), 'team not valid');
            assert(team.available(), 'team not available');

            let game = GameTrait::new(world.uuid(), team_id);
            team.location = game.id.into();
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
            let mut team_two = get!(world, team_id, (Team));


            assert(!(team_one.owner == caller), 'cant accept own challenge');
            assert(team_two.owner == caller, 'not team owner');
            assert(team_two.valid(), 'team not valid');
            assert(team_two.available(), 'team not available');

            let mut player = get!(world, caller,(Player));

            let manager = ManagerTrait::game(caller, player.counts.game_count, game.id);
            
            player.counts.game_count+=1;
            set_manager.challenge_count -=1;
            challenge_manager.id = challenge_tomove.id;
            challenge_tomove.id = 0;
            game.accept(team_two.id);
            team_two.location = game.id.into();
            self.update_pieces_locations(team_two.pieces, game.id.into() , true);

            set!(world, (game, team_two, player, manager, set_manager, challenge_manager, challenge_tomove));


        }

        fn take_turn(self: @ContractState, game_id: u32, piece_id: u32, x: u8, y: u8) {
            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();

            let mut game = get!(world, game_id, (Game));
            assert(game.data.is_active, 'game not active');
            let team_one = get!(world, game.data.team_one, (Team));
            let team_two = get!(world, game.data.team_two, (Team));

            if(game.data.ones_turn){
                assert(team_one.owner==caller, 'not turn player 1s turn');
            }
            else{
                assert(team_two.owner==caller, 'not turn player 2s turn');
            }
            let mut piece = get!(world, piece_id, (Piece));

            let valid: bool = self.check_next(piece.data.base_stats.type_id, piece.data.position, Vec2{x,y});
            assert(valid, 'invalid move');
            piece.data.position = Vec2{x,y};
            game.data.ones_turn = !game.data.ones_turn;

            set!(world, (piece, game));


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

        fn check_next(self: @ContractState, piece_type: u32, cur: Vec2, next:Vec2) -> bool {
            let mut moves = self.get_moves(piece_type.into());
            let mut valid = false;
            
            let mut i=0;

            loop {
                if(i == moves.len()) {break;};

                let move: Vec2 = moves.pop_front().unwrap();
                let (move_x, move_y) = move.vals();
                println!("checking move {move_x} , {move_y}");

                valid = self.check_move_valid(cur, move, next);
                if(valid) {break;};

                i+=1;
            };

            valid
        }

        fn check_move_valid(self: @ContractState, cur: Vec2, move: Vec2, next: Vec2) -> bool {

            let mut valid = false;

            let to_check = Vec2 {x: cur.x + move.x, y: cur.y + move.y};
            let (check_x, check_y) = to_check.vals();
            let (next_x, next_y) = next.vals();

            println!("checking vec {check_x} , {check_y} = {next_x}, {next_y}");
            valid = check_x == next_x && check_y == next_y; 
        
            if(valid) { return valid; };

            let to_check = Vec2 {x: cur.x - move.x, y: cur.y + move.y};
            let (check_x, check_y) = to_check.vals();
            let (next_x, next_y) = next.vals();

            println!("checking vec {check_x} , {check_y} = {next_x}, {next_y}");
            valid = check_x == next_x && check_y == next_y; 
        
            if(valid) { return valid; };

            let to_check = Vec2 {x: cur.x + move.x, y: cur.y - move.y};
            let (check_x, check_y) = to_check.vals();
            let (next_x, next_y) = next.vals();

            println!("checking vec {check_x} , {check_y} = {next_x}, {next_y}");
            valid = check_x == next_x && check_y == next_y; 
        
            if(valid) { return valid; };

            let to_check = Vec2 {x: cur.x - move.x, y: cur.y - move.y};
            let (check_x, check_y) = to_check.vals();
            let (next_x, next_y) = next.vals();

            println!("checking vec {check_x} , {check_y} = {next_x}, {next_y}");
            valid = check_x == next_x && check_y == next_y; 
        
            valid

        }

        fn get_moves(self: @ContractState, piece_type: u32) -> Array<Vec2> {
                let mut res = ArrayTrait::new();
                if(piece_type == 0) {
                    res.append(Vec2{x:1,y:0});
                    res.append(Vec2{x:1,y:1});
                    res.append(Vec2{x:0,y:1});
                }
                if(piece_type == 1) {
                    res.append(Vec2{x:1,y:0});
                    res.append(Vec2{x:1,y:1});
                    res.append(Vec2{x:0,y:1});

                }
                if(piece_type == 2) {
                    res.append(Vec2{x:1,y:0});
                    res.append(Vec2{x:2,y:0});
                    res.append(Vec2{x:0,y:1});
                    res.append(Vec2{x:0,y:2});

                }
                if(piece_type == 3) {
                    res.append(Vec2{x:1,y:1});
                    res.append(Vec2{x:2,y:2});

                }
                res
            }
    }
}

#[cfg(test)]
mod tests {
    use starknet::ContractAddress;

    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use super::{arena, IArenaDispatcher, IArenaDispatcherTrait};

    use project::tests::tests::{spawn_set_and_players};

    use project::models::team::{team};
    use project::models::team::{Team, TeamTrait};

    use project::models::manager::{set_manager, manager, player_count};
    use project::models::manager::{SetManager, Manager, PlayerCount};

    use project::models::piece::{piece, piece_type};
    use project::models::piece::{Piece, PieceType, PieceStats};

    use project::models::player::{player};
    use project::models::player::{Player};

    use project::models::game::{game};
    use project::models::game::{Game, Vec2};

    fn setup_game(world: IWorldDispatcher, arena: IArenaDispatcher, p1: ContractAddress, p2: ContractAddress) -> u32 {
        let player = get!(world, p1, Player);
        let op = get!(world, p2, Player);
        assert(player.counts.team_count > 0, 'p1 should have team');
        assert(op.counts.team_count > 0, 'p2 should have team');
        
        starknet::testing::set_contract_address(p1);
        let team_id = get!(world, (p1, 3, 0), Manager).id;
        arena.create_challenge(team_id.try_into().unwrap());

        let challenge = get!(world, (0, 5, 0), Manager);

        starknet::testing::set_contract_address(p2);
        let team_id = get!(world, (p2,3,0), Manager).id;
        arena.accept_challenge(challenge.id.try_into().unwrap(), team_id.try_into().unwrap());
        let game = get!(world, challenge.id, Game);
        assert(game.data.is_active, 'game should be active');
        game.id

    } 

    #[test]
    #[available_gas(300000000000)]
    fn test_challenge() {
        // caller
        let p1 = starknet::contract_address_const::<0x1>();

        let p2 = starknet::contract_address_const::<0x2>();

        // models
        let (world, _hub, _builder, _genshin, _gov, arena) = spawn_set_and_players(p1, p2);

        starknet::testing::set_contract_address(p1);
        let team_id = get!(world, (p1, 3, 0), Manager).id;
        arena.create_challenge(team_id.try_into().unwrap());
        let team_one = get!(world, team_id, Team);
        assert(!team_one.available(), 'team should not be available');
        let set = get!(world, 0, SetManager);
        let player = get!(world, p1, Player);
        assert(set.challenge_count == 1, 'should be 1 challenge');
        assert(player.counts.game_count == 1, 'player should have 1 game');
        let challenge = get!(world, (0, 5, 0), Manager);
        let player_game_id = get!(world, (p1,2,0), Manager).id;
        let game = get!(world, challenge.id, Game);
        assert(!game.data.is_active, 'game should not be active');

        assert(challenge.id == player_game_id, 'player and challenge no match');

        starknet::testing::set_contract_address(p2);
        let team_id = get!(world, (p2,3,0), Manager).id;
        arena.accept_challenge(challenge.id.try_into().unwrap(), team_id.try_into().unwrap());
        let team_two = get!(world, team_id, Team);
        assert(!team_two.available(), 'team should not be available');

        let game = get!(world, challenge.id, Game);
        assert(game.data.team_one == team_one.id, 'wrong team one');
        assert(game.data.team_two == team_two.id, 'wrong team two');
        assert(game.data.is_active, 'game should be active');
        let set = get!(world, 0, SetManager);
        assert(set.challenge_count == 0, 'challenge should be removed');

    }


    #[test]
    #[available_gas(300000000000)]
    fn test_game() {

        let p1 = starknet::contract_address_const::<0x1>();

        let p2 = starknet::contract_address_const::<0x2>();

        // models
        let (world, _hub, _builder, _genshin, _gov, arena) = spawn_set_and_players(p1, p2);
        let game_id = setup_game(world, arena, p1, p2);

        let game = get!(world, game_id, Game);
        assert(game.data.is_active, 'game should be active');
        let team_one = get!(world, game.data.team_one, Team);
        let team_two = get!(world, game.data.team_two, Team);
        assert(team_one.owner ==   p1.into(), 'team one owner should be p1');
        assert(team_two.owner == p2.into(), 'team two owner should be p2');
        
        starknet::testing::set_contract_address(p1);
        let one_tower = get!(world, team_one.pieces.tower, Piece);
        let new = Vec2 {x: one_tower.data.position.x - 1 , y: one_tower.data.position.y};
        let old_x = one_tower.data.position.x;
        let old_y = one_tower.data.position.y;
        let new_x = new.x;
        let new_y = new.y;
        println!("moving from {old_x},{old_y} to {new_x},{new_y}");
        arena.take_turn(game_id, one_tower.id, new.x, new.y);
        let one_tower = get!(world, team_one.pieces.tower, Piece);
        assert(one_tower.data.position.x == 3, 'piece should have moved');


    }
}
