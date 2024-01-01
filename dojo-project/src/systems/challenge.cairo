#[starknet::interface]
trait IChallenge<TContractState> {
    fn create_challenge(self: @TContractState, team_id: u32);
    fn accept_challenge(self: @TContractState, game_id: u32, team_id: u32);
}

#[dojo::contract]
mod challenge {
    use project::models::team::{Team};
    use project::models::game::{Game, GameTrait};
    use starknet::{get_caller_address};
    use super::IChallenge;

    #[external(v0)]
    impl ChallengeImpl of IChallenge<ContractState> {
        fn create_challenge(self: @ContractState, team_id: u32){
            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();


            let team = get!(world, team_id, (Team));
            assert(team.owner == caller, 'not team owner');

            let game = GameTrait::new(world.uuid(), team_id);
            set!(world, (team, game));
        }

        fn accept_challenge(self: @ContractState, game_id: u32, team_id: u32){
            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();

            let mut game = get!(world, game_id, (Game));
            let team_one = get!(world, game.data.team_one, (Team));
            let team_two = get!(world, team_id, (Team));

            assert(!(team_one.owner == caller), 'cant challenge self');
            assert(team_two.owner == caller, 'not team owner');

            game.accept(team_two.id);

            set!(world, (game));


        }
    }
}