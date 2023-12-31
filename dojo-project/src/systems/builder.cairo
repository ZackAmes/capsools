#[starknet::interface]
trait IBuilder<TContractState> {
    fn create_team(self: @TContractState);
    fn add_piece_to_team(self: @TContractState, piece_id: u32, team_id: u32, x: u8, y: u8);
    fn remove_piece_from_team(self: @TContractState, piece_id: u32, team_id: u32);
}

#[dojo::contract]
mod builder {

    use super::IBuilder;
    use starknet::{ContractAddress, get_caller_address};
    use project::models::player::{Player, PlayerTrait};
    use project::models::game::{Game, GameTrait, Vec2};
    use project::models::piece::{Piece, PieceTrait};
    use project::models::team::{Team, TeamTrait};
    use project::models::manager::{Manager, ManagerTrait};


    #[external(v0)]
    impl BuildereImpl of IBuilder<ContractState>{

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

        fn add_piece_to_team(self: @ContractState, piece_id: u32, team_id: u32, x: u8, y: u8) {

            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();

            let mut piece = get!(world, piece_id, (Piece));
            assert(piece.data.owner == caller, 'not piece owner');
            assert(piece.available(), 'piece not available');
            //12x12 board, base is middle 6
            //0,1,2  || 3,4,5,6,7,8 || 9,10,11
            assert(x > 2 && x < 9, 'invalid x');
            assert(y >=0 && y<2, 'invalid y');


            let mut team = get!(world, team_id, (Team));
            assert(team.owner == caller, 'not team owner');
            team.add_piece(piece_id);
            piece.data.position = Vec2 {x: x.try_into().unwrap(), y: y.try_into().unwrap()};
            piece.data.location = team_id.into();

            set!(world, (team, piece));

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

}
