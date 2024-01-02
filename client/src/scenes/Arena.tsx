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
import AccRender from "../components/AccRender";

import get_ids from "../utils/get_ids";

interface ArenaProps {
    setup: {
        components: any,
        systemCalls: any
    }
    account: any
    challenge_count: any
    counts: any
    position: [number, number, number]
}

const Arena: FC<ArenaProps> = ({setup: {components, systemCalls},challenge_count, account, counts, position}) => {

    let {accept_challenge, create_challenge, take_turn} = systemCalls;
    let signer = account.account;

    const game_ids = get_ids(components.Manager, signer.address, counts.game_count as number, "game");
    const team_ids = get_ids(components.Manager, signer.address, counts.team_count as number, "team");
    const challenge_ids: Entity[] = get_ids(components.Manager, 0, challenge_count, "challenge");

    let [cur_game, set_game] = useState(0);
    let [cur_team, set_team] = useState(0);

    let team = getComponentValue(components.Team, team_ids[cur_team]);

    const potential = challenge_ids.map( (game_id) => {
        let game = getComponentValue(components.Game, game_id);
        let is_challenger = game_ids.includes(game_id);
        let index=0;
        if(!is_challenger){
            let team_key = game? game.data.team_one : 0
            let challenger_id = getEntityIdFromKeys([BigInt(team_key)]);
            let challenger_team = getComponentValue(components.Team, challenger_id);
            
            let address = challenger_team ? challenger_team.owner.toString(16) : ''
            let temp_game_id = game? game.id : 0;
            let team_id = team? team.id : 0;
            console.log(temp_game_id);
            console.log(team_id);
            index+=1;

            return (
                <AccRender key={game_id} address={address} 
                        position={[index % 10, 6 + Math.floor(index / 10 ), 0]} 
                        onClick={() => accept_challenge(account.account, temp_game_id, team_id)}
                />
            )
        }
    })

    let team_piece_ids: Entity[] = [];

    let pieces = [];
    let piece_positions = [];
    

    if(team) {
        let pieces_count = team.piece_count;

        let ids_array: number[] = Object.values(team.pieces)

        for(let i=0; i<pieces_count; i++) {
            let key = ids_array[i] ? ids_array[i] : 0;
            let id = getEntityIdFromKeys([BigInt(key)]) as Entity;
            let piece = getComponentValue(components.Piece, id);
            if(piece){
                piece_positions.push({x:piece.data.position.x, y:piece.data.position.y, type: piece.data.piece_type, id: piece.id})
            }
            team_piece_ids.push(id);
        }

    }



    return (
        <group position= {position}>
            <Selector position={[-1,3,-5]} total={game_ids.length} label={"game"} cur={cur_game} next={()=>set_game(cur_game+1)} prev={()=> set_game(cur_game-1)}/>
            <Selector position={[-1,2,-5]} total={team_ids.length} label={"team"} cur={cur_team} next={()=>set_team(cur_team+1)} prev={()=> set_team(cur_team-1)}/>


            {team && <Button scale = {.75} color={"blue"} position={[-5,5,0]} 
                    label={"CREATE CHALLENGE WITH TEAM: " + cur_team} onClick={() => create_challenge(signer, team?.id)}/>}
            {team && <Button scale = {.75} color={"blue"} position={[-5,6,0]} 
                    label={"ACCEPT OPEN CHALLENGE:"} onClick={() => console.log("")}/>}
            
            <Board position={[0,0,0]} components={components} game_id={game_ids[cur_game]} signer={signer} take_turn={take_turn}/>
            
            {potential}
        </group>
    )
}   

export default Arena;