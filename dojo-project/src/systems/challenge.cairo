#[starknet::interface]
trait IChallenge<TContractState> {
    fn create_team(self: @TContractState);
    fn add_piece_to_team(self: @TContractState, piece_id: u32, team_id: u32);
    fn remove_piece_from_team(self: @TContractState, piece_id: u32, team_id: u32);
}

#[dojo::contract]
mod challenge {

    use super::IChallenge;
    use starknet::{ContractAddress, get_caller_address};
    use project::models::player::{Player, PlayerTrait};
    use project::models::game::{Game, GameTrait};
    use project::models::piece::{Piece, PieceTrait};
    use project::models::team::{Team, TeamTrait};
    use project::models::manager::{Manager, ManagerTrait};


    impl ChallengeImpl of IChallenge<ContractState>{

        fn create_team(self: @ContractState) {
            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();
            let mut player = get!(world, caller, (Player));

            let count = player.team_count();

            let team = TeamTrait::new(world.uuid(), caller);
            let manager = ManagerTrait::team(caller, count, team.id.into());
            player.increment_teams();
            
            set!(world, (player, team, manager));
        }

        fn add_piece_to_team(self: @ContractState, piece_id: u32, team_id: u32) {

            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();

            let mut piece = get!(world, piece_id, (Piece));
            assert(piece.owner() == caller, 'not piece owner');
            assert(piece.available(), 'piece not available');

            let mut team = get!(world, team_id, (Team));
            assert(team.owner == caller, 'not team owner');
            team.add_piece(piece_id);
            piece.update_location(team_id.into());

            set!(world, (team, piece));

        }

        fn remove_piece_from_team(self: @ContractState, piece_id: u32, team_id: u32){
            let world = self.world_dispatcher.read();

            let caller = get_caller_address().into();

            let mut team = get!(world, team_id, (Team));

            assert(team.owner == caller, 'not team owner');
            assert(team.contains(piece_id), 'piece not in team');
            team.remove_piece(piece_id);

        }

        
    }

}
