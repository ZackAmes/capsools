
#[cfg(test)]
mod tests {
    use starknet::class_hash::Felt252TryIntoClassHash;
    use starknet::{ContractAddress};

    // import world dispatcher
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    // import test utils
    use dojo::test_utils::{spawn_test_world, deploy_contract};

    // import models
    use project::models::team::{team};
    use project::models::team::{Team, TeamTrait};

    use project::models::manager::{set_manager, manager, player_count};
    use project::models::manager::{SetManager, Manager, PlayerCount};

    use project::models::piece::{piece, piece_type};
    use project::models::piece::{Piece, PieceType, PieceStats};

    use project::models::player::{player};
    use project::models::player::{Player};

    use project::models::game::{game};
    use project::models::game::{Game};


    // import actions
    use project::systems::builder::{builder, IBuilderDispatcher, IBuilderDispatcherTrait};
    use project::systems::hub::{hub, IHubDispatcher, IHubDispatcherTrait};
    use project::systems::genshin::{genshin, IGenshinDispatcher, IGenshinDispatcherTrait};
    use project::systems::arena::{arena, IArenaDispatcher, IArenaDispatcherTrait};
    use project::systems::gov::{gov, IGovDispatcher, IGovDispatcherTrait};


    

    fn spawn_set_and_players(p1: ContractAddress, p2: ContractAddress) -> (IWorldDispatcher, 
                                                                            IHubDispatcher, 
                                                                            IBuilderDispatcher, 
                                                                            IGenshinDispatcher,
                                                                            IGovDispatcher,
                                                                            IArenaDispatcher ) {
        let mut models = array![set_manager::TEST_CLASS_HASH,
                                piece_type::TEST_CLASS_HASH,
                                piece::TEST_CLASS_HASH,
                                team::TEST_CLASS_HASH,
                                game::TEST_CLASS_HASH,
                                manager::TEST_CLASS_HASH,
                                player_count::TEST_CLASS_HASH,
                                player::TEST_CLASS_HASH];

        // deploy world with models
        let world = spawn_test_world(models);

        // deploy systems contract
        let builder_address = world
            .deploy_contract('salt1', builder::TEST_CLASS_HASH.try_into().unwrap());
        
        let hub_address = world
            .deploy_contract('salt2', hub::TEST_CLASS_HASH.try_into().unwrap());

        let genshin_address = world
            .deploy_contract('salt3', genshin::TEST_CLASS_HASH.try_into().unwrap());

        let arena_address = world
            .deploy_contract('salt4', arena::TEST_CLASS_HASH.try_into().unwrap());

        let gov_address = world
            .deploy_contract('salt5', gov::TEST_CLASS_HASH.try_into().unwrap());

        let builder = IBuilderDispatcher { contract_address: builder_address };
        let hub = IHubDispatcher {contract_address: hub_address};
        let genshin = IGenshinDispatcher {contract_address : genshin_address};
        let arena = IArenaDispatcher {contract_address : arena_address};
        let gov = IGovDispatcher {contract_address : gov_address};

        // call spawn()
        hub.spawn();

        // Check world state
        let types = get!(world, 0, SetManager).piece_type_count;

        // check moves
        assert(types == 4, 'types is wrong');

        starknet::testing::set_contract_address(p1);
        hub.new_player('player');
        builder.starter_team();

        starknet::testing::set_contract_address(p2);
        hub.new_player('op');
        builder.starter_team();

        let player_team_count = get!(world, p1, Player).counts.team_count;
        let op_team_count = get!(world, p2, Player).counts.team_count;
        
        assert(player_team_count == 1 , 'invalid player team count');
        assert(op_team_count == 1 , 'invalid op team count');

        (world, hub, builder, genshin, gov, arena)
    }


}