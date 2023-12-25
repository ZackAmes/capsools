use project::models::piece::{PieceType};

#[derive(Model, Drop, Serde)]
struct RedPiece {
    #[key]
    piece_id: u32,
    data: u8
}

