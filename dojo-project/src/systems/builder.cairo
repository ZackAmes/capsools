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


    #[external(v0)]
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
            let mut tower = PieceTrait::new(world.uuid(), caller, stats.hp, tower_id);     
            tower.add_to(team.id.into(), Vec2 {x:4 + offset, y:1});
            offset+=1;

            let mut piece_one = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);
            piece_one.add_to(team.id.into(), Vec2 {x:4+ offset, y:1});
            offset+=1;

            let mut piece_two = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);
            piece_two.add_to(team.id.into(), Vec2 {x:4+ offset, y:1});
            offset+=1;

            let mut piece_three = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);
            piece_three.add_to(team.id.into(), Vec2 {x:4+ offset, y:1});
            offset+=1;

            let mut piece_four = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);
            piece_four.add_to(team.id.into(), Vec2 {x:4+ offset, y:1});
            offset+=1;

            let mut piece_five = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);
            piece_five.add_to(team.id.into(), Vec2 {x:4+ offset, y:1});

            let mut team_pieces = PiecesTrait::new_from(tower.id, piece_one.id, piece_two.id, piece_three.id, piece_four.id, piece_five.id);
            
            player.counts.team_count += 1;
            team.pieces = team_pieces;
            team.piece_count = 6;
            set!(world, (player, team, tower, piece_one, piece_two, piece_three, piece_four, piece_five));


            
            //player.counts.pieces_count +=6;

            let manager = ManagerTrait::team(caller, count, team.id);

            //todo piece managers

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
            assert(piece.available(), 'piece not available');
            let mut team = get!(world, team_id, (Team));
            team.add_piece(piece_id);
            let position = Vec2{x: team.piece_count + 4, y:1};
            let team_location:felt252 = team_id.into();

            piece.add_to(team_location, position);
            set!(world, (piece, team));
        }

        fn remove_piece_from_team(self: @ContractState, piece_id: u32, team_id: u32){
            let world = self.world_dispatcher.read();

            let caller = get_caller_address().into();

            let mut team = get!(world, team_id, (Team));

            assert(team.owner == caller, 'not team owner');

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
