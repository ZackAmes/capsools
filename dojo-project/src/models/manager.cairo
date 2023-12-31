
#[derive(Model, Drop, Serde)]
struct PlayerCount {
    #[key]
    world: felt252,
    count: u32
}

#[derive(Model, Drop, Serde)]
struct SetManager {
    #[key]
    set_id: u32,
    piece_type_count: u32,
    challenge_count: u32
}


#[derive(Model, Drop, Serde)]
struct Manager {
    #[key]
    owner: felt252,
    #[key]
    label: u8,
    #[key]
    index: u32,
    id: felt252
}

trait ManagerTrait{
    fn player(owner: felt252, index: u32, id: felt252) -> Manager;
    fn piece(owner: felt252, index: u32, piece_id: u32) -> Manager;
    fn game(owner: felt252, index: u32, game_id: u32) -> Manager;
    fn team(owner: felt252, index: u32, team_id: u32) -> Manager;
    fn challenge(set_id: u32, index: u32, game_id: u32) -> Manager;

    fn piece_type(set_id: u32, index: u32, piece_type_id: u32) -> Manager;

}

impl ManagerImpl of ManagerTrait {
    fn player(owner: felt252, index: u32, id: felt252) -> Manager {
        let label = 0;
        Manager {owner, label, index, id}
    }
    fn piece(owner: felt252, index: u32, piece_id: u32) -> Manager {
        let label = 1;
        let id = piece_id.into();
        Manager {owner, label, index, id}
    }
    fn game(owner: felt252, index: u32, game_id: u32) -> Manager {
        let label = 2;
        let id = game_id.into();
        Manager {owner, label, index, id}
    }
    fn team(owner: felt252, index: u32, team_id: u32) -> Manager {
        let label = 3;
        let id = team_id.into();
        Manager {owner, label, index, id}
    }

    fn piece_type(set_id: u32, index: u32, piece_type_id: u32) -> Manager{
        let label = 4;
        let owner = set_id.into();
        let id = piece_type_id.into();
        Manager {owner, label, index, id}
    }

    fn challenge(set_id: u32, index: u32, game_id: u32) -> Manager {
        let label = 5;
        let owner = set_id.into();
        let id = game_id.into();
        Manager {owner, label, index, id}
    }
}



