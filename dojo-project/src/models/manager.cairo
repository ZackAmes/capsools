
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
    fn team(owner: felt252, index: u32, id: felt252) -> Manager;

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
    fn team(owner: felt252, index: u32, id: felt252) -> Manager {
        let label = 3;
        Manager {owner, label, index, id}
    }
}



