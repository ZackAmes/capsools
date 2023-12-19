use starknet::ContractAddress;

#[derive(Model, Drop, Serde)]
struct PieceManager {
    #[key]
    owner:ContractAddress,
    #[key]
    index: u32,
    piece_id: u32
}


#[derive(Model, Drop, Serde)]
struct Piece {
    #[key]
    piece_id: u32,
    owner: ContractAddress,
    location: ContractAddress,
    piece_type: u8
}