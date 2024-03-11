#[starknet::interface]
trait IBuilder<TContractState> {
    fn create_team(self: @TContractState);
    fn remove_piece_from_team(self: @TContractState, piece_id: u32, team_id: u32);
    fn starter_team(self: @TContractState);
    fn add_piece_to_team(self: @TContractState, piece_id: u32, team_id: u32);

}

#[dojo::contract]
mod builder {

    use super::IBuilder;
    use starknet::{ContractAddress, get_caller_address};
    use project::models::player::{Player, PlayerTrait};
    use project::models::game::{Game, GameTrait, Vec2};
    use project::models::piece::{Piece, PieceTrait, PieceType};
    use project::models::team::{Team, TeamTrait, PiecesTrait, Pieces};
    use project::models::manager::{Manager, ManagerTrait};


    #[abi(embed_v0)]
    impl BuilderImpl of IBuilder<ContractState>{

        fn starter_team(self: @ContractState) {
            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();

            let mut player = get!(world, caller, (Player));
            let count = player.counts.team_count;

            assert(!(player.name ==''), 'player not created' );

            let mut team = TeamTrait::new(world.uuid(), caller);

            let mut tower_index = 0;
            let mut piece_index = 2;
            if(count % 2 == 1) {
                tower_index +=1;
                piece_index +=1;
            }

            let tower_id = get!(world, (0,4,tower_index), (Manager)).id.try_into().unwrap();
            let type_id = get!(world, (0,4,piece_index), (Manager)).id.try_into().unwrap();

            let stats = get!(world, type_id, (PieceType)).piece_stats;
        
            let mut offset = 0;
            let mut x:u8 =4;
            let mut tower = PieceTrait::new(world.uuid(), caller, stats.base_hp, tower_id);  
            let manager_t = ManagerTrait::piece(caller, count+offset, tower.id);   
            tower.add_to(team.id.into(), Vec2 {x, y:1});
            offset+=1;
            x+=1;

            let mut piece_one = PieceTrait::new(world.uuid(), caller, stats.base_hp, type_id);
            let manager_1 = ManagerTrait::piece(caller, count+offset, piece_one.id);   

            piece_one.add_to(team.id.into(), Vec2 {x, y:1});
            offset+=1;
            x+=1;


            let mut piece_two = PieceTrait::new(world.uuid(), caller, stats.base_hp, type_id);
             let manager_2 = ManagerTrait::piece(caller, count+offset, piece_two.id);   

            piece_two.add_to(team.id.into(), Vec2 {x, y:1});
            offset+=1;
            x+=1;

            let mut piece_three = PieceTrait::new(world.uuid(), caller, stats.base_hp, type_id);
            let manager_3 = ManagerTrait::piece(caller, count+offset, piece_three.id);   
            piece_three.add_to(team.id.into(), Vec2 {x, y:1});
            offset+=1;
            x+=1;

            let mut piece_four = PieceTrait::new(world.uuid(), caller, stats.base_hp, type_id);
            let manager_4 = ManagerTrait::piece(caller, count+offset, piece_four.id);   
            piece_four.add_to(team.id.into(), Vec2 {x, y:1});
            offset+=1;
            x+=1;

            let mut piece_five = PieceTrait::new(world.uuid(), caller, stats.base_hp, type_id);
            let manager_5 = ManagerTrait::piece(caller, count+offset, piece_five.id);   
            piece_five.add_to(team.id.into(), Vec2 {x, y:1});

            let mut team_pieces = PiecesTrait::new_from(tower.id, piece_one.id, piece_two.id, piece_three.id, piece_four.id, piece_five.id);
            
            player.counts.team_count += 1;
            player.counts.piece_count += 6;
            team.pieces = team_pieces;
            team.piece_count = 6;
            set!(world, (player, team, tower, manager_1, manager_2, manager_3, manager_4, manager_5, manager_t,
                        piece_one, piece_two, piece_three, piece_four, piece_five));


            

            let manager = ManagerTrait::team(caller, count, team.id);


            set!(world, (manager));


        }

        fn create_team(self: @ContractState) {
            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();
            let mut player = get!(world, caller, (Player));
            assert(!(player.name ==''), 'player not created' );
            assert(player.counts.team_count <= 10, 'too many teams');

            let count = player.counts.team_count;

            let team = TeamTrait::new(world.uuid(), caller);
            let manager = ManagerTrait::team(caller, count, team.id);
            
            player.counts.team_count +=1;
            
            set!(world, (player, team, manager));
        }

        fn add_piece_to_team(self: @ContractState, piece_id: u32, team_id: u32){
            let world = self.world_dispatcher.read();

            let mut piece = get!(world, piece_id, (Piece));
            let caller = get_caller_address().into();

            assert(caller == piece.data.owner, 'not piece owner');
            assert(piece.available(), 'piece not available');
            let mut team = get!(world, team_id, (Team));
            assert(team.available(), 'team not available');

            team.add_piece(piece_id);
            let position = Vec2{x: team.piece_count + 3, y:1};
            let team_location:felt252 = team_id.into();

            piece.add_to(team_location, position);
            set!(world, (piece, team));
        }

        fn remove_piece_from_team(self: @ContractState, piece_id: u32, team_id: u32){
            let world = self.world_dispatcher.read();

            let caller = get_caller_address().into();

            let mut team = get!(world, team_id, (Team));

            assert(team.owner == caller, 'not team owner');
            assert(team.available(), 'team not available');

            let mut piece = get!(world, piece_id, (Piece));
            assert(piece.data.owner == caller, 'not piece owner?');

            let location:felt252 = team_id.into();
            assert(piece.data.location == location, 'piece not in team');

            team.remove_piece(piece_id);
            piece.add_to(piece.data.owner, Vec2{x:0,y:0});
            set!(world, (team, piece));
        }

        

        
    }

    #[generate_trait]
    impl Private of PrivateTrait {

        
        

    }

}
