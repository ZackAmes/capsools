use dojo_starter::models::position::{Vec2};

#[derive(Drop, Serde)]
#[dojo::model]
struct Piece {
    #[key]
    piece_id: u32,
    moves: Array<Vec2>,
    attacks: Array<Vec2>,
    health: u32

}
