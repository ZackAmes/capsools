import { FC, useState } from "react";
import { getComponentValue, Entity } from "@dojoengine/recs";
import Team from "../components/Team";
import Pieces from "./Pieces";
import Button from "../components/Button";

import { getEntityIdFromKeys } from "@dojoengine/utils";
import update_position from "../utils/update_position";
import Selector from "../components/Selector";



interface TeamsProps {
    setup: {
        components: any,
        systemCalls: any
    }
    account: any
    piece_ids: any[]
    team_ids: any[]
    position: [number, number, number]
}

const TeamBuilder: FC<TeamsProps> = ({setup: {components, systemCalls}, account, piece_ids, team_ids, position}) => {

    const signer = account.account;
    const {add_piece_to_team, create_team, mint_piece} = systemCalls;

    const [cur_team, set_team] = useState(0);
    const [cur_piece, set_piece] = useState();
    const [cur_square, set_square] = useState([]);

    let team = getComponentValue(components.Team , team_ids[cur_team]);
    let team_piece_ids: Entity[] = [];

    let pieces = [];

    if(team) {
        let pieces_count = team.piece_count;

        let ids_array: number[] = Object.values(team.pieces)

        for(let i=0; i<pieces_count; i++) {
            let id = getEntityIdFromKeys([BigInt(ids_array[i])]) as Entity;
            team_piece_ids.push(id);
        }

    }
    
    let pieces_position = update_position(position, [0,0,3])
    let add_position = update_position(position, [1,5,0])
    let create_position = update_position(position, [1,4,0])
    let mint_position = update_position(position, [1,5,0])

    let selector_position = update_position(position, [1,6,0]);


    const add_piece = (x: number, y:number) => {
        if(team){
            add_piece_to_team(signer, cur_piece, team.id, x, y);
        }
    }
    let total_teams = team_ids.length;

    return (
        <>
            <group position={position}>
                <Selector position={selector_position} total={total_teams} label ="team" cur={cur_team} next={()=>set_team(cur_team+1)} prev={()=> set_team(cur_team-1)}/>
               
                <Button position = {mint_position} label={"mint piece"} onClick={() => mint_piece(signer)}/>

                {/*cur_piece && team && cur_square && 
                    <Button position = {add_position} label={"add " + cur_piece + " to team " + team.id}
                            onClick = {() => add_piece(cur_square[0], cur_square[1])}/>
                */}
                <Team position={position} piece_ids={team_piece_ids} components={components} set_square={( () => console.log("test"))}/>
                <Pieces pieceComponent={components.Piece}
                        piece_ids={piece_ids} position = {pieces_position}
                        set_piece = {set_piece}/>
            </group>
        </>
    )
}

export default TeamBuilder;