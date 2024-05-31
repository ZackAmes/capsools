use starknet::ContractAddress;
use dojo_starter::models::position::{Vec2, Vec2Trait, Vec2Impl};
#[derive(Model, Drop, Serde)]
#[dojo::model]
struct Moves {
    #[key]
    piece_id: u32,
    valid: Array<Vec2>,
}

#[generate_trait]
impl MovesImpl of MovesTrait {
    
    fn new(piece_id: u32, valid: Array<Vec2> ) -> Moves {
        Moves {piece_id, valid}
    }

    fn check(self: Moves, cur: Vec2, move: Vec2) -> bool {
        let mut valid_moves = self.valid.span();
        let mut valid = false;

        loop {
            let maybe_next = valid_moves.pop_front();
            
            match maybe_next {
                Option::Some(next) => {
                    valid = (cur.x + *next.x == move.x && cur.y + *next.y == move.y);
                    if valid { break; }
                    valid = (cur.x + *next.x == move.x &&  cur.y - *next.y == move.y);
                    if valid { break; }
                    valid = (cur.x - *next.x == move.x && cur.y + *next.y == move.y);
                    if valid { break; }
                    valid = (cur.x - *next.x == move.x && cur.y - *next.y == move.y);
                    if valid { break; }
                },
                Option::None => {
                    break;
                }
            }
        };
        valid
    }
}
