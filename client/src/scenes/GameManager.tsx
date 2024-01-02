import { FC, useState } from "react";
import { getComponentValue, Entity } from "@dojoengine/recs";
import Board from "../components/Board";
import Pieces from "./Pieces";
import Piece from "../components/Piece";
import Button from "../components/Button";

import { useComponentValue } from "@dojoengine/react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import update_position from "../utils/update_position";
import Selector from "../components/Selector";



interface GameManagerProps {
    setup: {
        components: any,
        systemCalls: any
    }
    account: any
    game_ids: any[]
    position: [number, number, number]
}

const GameManager: FC<GameManagerProps> = ({setup: {components, systemCalls}, account, game_ids, position}) => {

    const signer = account.account;
    const {add_piece_to_team, create_team} = systemCalls;

    const [cur_game, set_game] = useState(0);
    const [cur_piece, set_piece] = useState();
    const [cur_square, set_square] = useState([]);
    let game_id = game_ids ? game_ids[0] : 0;
    console.log(game_id as number)
    let game = useComponentValue(components.Game, game_id);
    console.log(game);
    let pieces;
    let piece_ids:number[] = [];

    if(game) {
        
        let team_one = getComponentValue(components.Team, getEntityIdFromKeys([BigInt(game.data.team_one)]) as Entity);
        let one_piece_ids:number[] = [];
        let two_piece_ids:number[] = [];
        let team_two = getComponentValue(components.Team, getEntityIdFromKeys([BigInt(game.data.team_two)]) as Entity);
        two_piece_ids = team_two ? Object.values(team_two.pieces) : [];

        
        one_piece_ids= team_one ? Object.values(team_one.pieces) : [];
        console.log(two_piece_ids);

        piece_ids = one_piece_ids.concat(two_piece_ids);
        console.log(piece_ids);
        let pieces = piece_ids.map( (piece_id) => {
            let id = getEntityIdFromKeys([BigInt(piece_id)]) as Entity
            let piece = getComponentValue(components.Piece, id);
            if(piece){
                let piece_position: [number, number, number] = update_position(position, [piece.data.position.x, 2.1, piece.data.position.y]);
                return (<Piece key={piece.id} position={piece_position} type={piece.data.piece_type} onClick={() => console.log(piece?.id)}/>)
            }    
        })
    }
    let total_games = game_ids.length;
    let selector_position = update_position(position, [0,3,0]);
    

    return (
        <>
            <group position={position}>
                <Selector position={selector_position} total={total_games} label={cur_game} next={()=>set_game(cur_game+1)} prev={()=> set_game(cur_game-1)}/>
                

                <Board game_id={game_ids[cur_game]} piece_ids = {piece_ids} position={position} signer={signer} components={components} />
                {pieces}
            </group>
        </>
    )
}

export default GameManager;
