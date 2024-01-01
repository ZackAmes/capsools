#[starknet::interface]
trait IBuilder<TContractState> {
    fn create_team(self: @TContractState);
    fn remove_piece_from_team(self: @TContractState, piece_id: u32, team_id: u32);
    fn starter_team(self: @TContractState);
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
    use core::box::{Box, BoxTrait};


    #[external(v0)]
    impl BuilderImpl of IBuilder<ContractState>{

        fn starter_team(self: @ContractState) {
            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();

            let mut player = get!(world, caller, (Player));
            let count = player.counts.team_count;

            assert(!(player.name ==''), 'player not created' );
            assert(count == 0, 'already claimed' );

            let mut team = TeamTrait::new(world.uuid(), caller);

            let type_id = get!(world, (0,4,0), (Manager)).id.try_into().unwrap();
            let stats = get!(world, type_id, (PieceType)).piece_stats;

        
            let mut tower = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);     
            tower.add_to(team.id.into(), Vec2 {x:5, y:1});

            let mut piece_one = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);
            piece_one.add_to(team.id.into(), Vec2 {x:6, y:1});

            let mut piece_two = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);
            piece_two.add_to(team.id.into(), Vec2 {x:4, y:1});

            let mut piece_three = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);
            piece_three.add_to(team.id.into(), Vec2 {x:7, y:1});

            let mut piece_four = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);
            piece_four.add_to(team.id.into(), Vec2 {x:8, y:1});

            let mut piece_five = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);
            piece_five.add_to(team.id.into(), Vec2 {x:9, y:1});

            let mut team_pieces = PiecesTrait::new_from(tower.id, piece_one.id, piece_two.id, piece_three.id, piece_four.id, piece_five.id);
            
            team.pieces = team_pieces;
            set!(world, (team, tower, piece_one, piece_two, piece_three, piece_four, piece_five));
            
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

            let count = player.counts.team_count;

            let team = TeamTrait::new(world.uuid(), caller);
            let manager = ManagerTrait::team(caller, count, team.id);
            
            player.counts.team_count +=1;
            
            set!(world, (player, team, manager));
        }

        fn remove_piece_from_team(self: @ContractState, piece_id: u32, team_id: u32){
            let world = self.world_dispatcher.read();

            let caller = get_caller_address().into();

            let mut team = get!(world, team_id, (Team));

            assert(team.owner == caller, 'not team owner');
            assert(team.contains(piece_id), 'piece not in team');
            //TODO: FIX
            //team.remove_piece(piece_id);

        }

        

        
    }

    #[generate_trait]
    impl Private of PrivateTrait {
        

    }

}
