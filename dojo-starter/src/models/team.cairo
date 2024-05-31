use starknet::ContractAddress;

#[derive(Drop, Serde)]
#[dojo::model]
struct Team {
    #[key]
    team_id: u32,
    owner: ContractAddress,
    pieces: Array<u32>
}

#[derive(Copy, Drop, Serde)]
enum Status {
    Inactive, 
    Active: u32,
    
}
