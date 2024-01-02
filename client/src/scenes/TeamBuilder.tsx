import { FC, useState } from "react";
import { getComponentValue, Entity } from "@dojoengine/recs";
import Team from "../components/Team";
import Pieces from "./Pieces";
import Button from "../components/Button";

import { getEntityIdFromKeys } from "@dojoengine/utils";
import update_position from "../utils/update_position";
import Selector from "../components/Selector";
import { useComponentValue } from "@dojoengine/react";
import PieceStats from "../components/PieceStats";


import get_ids from "../utils/get_ids";
import { contractClassResponseToLegacyCompiledContract } from "starknet";

interface TeamsProps {
    setup: {
        components: any,
        systemCalls: any
    }
    account: any
    counts: any
    position: [number, number, number]
}

const TeamBuilder: FC<TeamsProps> = ({setup: {components, systemCalls}, account, counts, position}) => {

    const signer = account.account;
    const {add_piece_to_team, create_team, mint_piece, create_starter_team, remove_piece_from_team} = systemCalls;

    const [cur_team, set_team] = useState(0);
    const [cur_piece, set_piece] = useState(0);
    const [cur_in_team, set_is_team] = useState(false);


    const piece_ids = get_ids(components.Manager, signer.address, counts.piece_count as number, "piece");
    const team_ids = get_ids(components.Manager, signer.address, counts.team_count as number, "team");

    let team = useComponentValue(components.Team , team_ids[cur_team]);

    let team_piece_ids: Entity[] = [];

    let available_ids = [];
    let piece_keys: number[];
    let piece_positions: any[] = [];
    let button_clicked= () => {};

    for(let i=0; i<piece_ids.length; i++) {
        let piece = getComponentValue(components.Piece, piece_ids[i]);
        if(piece?.data.owner == piece?.data.location) {
            available_ids.push(piece_ids[i])
        }
    }
    if(team) {

        piece_keys = Object.values(team.pieces) 
        

        for(let i=0; i<piece_keys.length; i++) {
            let key:number = piece_keys[i];
            if(key) {
                let id = getEntityIdFromKeys([BigInt(key)]) as Entity;
                let piece = getComponentValue(components.Piece, id);
                if(piece){
                    piece_positions.push({x:piece.data.position.x, y:piece.data.position.y, type: piece.data.piece_type, id: piece.id})
                    team_piece_ids.push(id);
                }    
            }
        }

        button_clicked = () => {
            if(cur_in_team && team) {
                console.log("removing" + cur_piece + "from" + team.id)
                remove_piece_from_team(signer, cur_piece, team.id);
            }
            else if(team){
                console.log("adding" + cur_piece + "to" + team.id)
                add_piece_to_team(signer, cur_piece, team.id)
            }
        }

    }
    
    let pieces_position = update_position(position, [0,0,3])
    let add_position = update_position(position, [3,2,0])
    let create_position = update_position(position, [1,4,0])
    let mint_position = update_position(position, [-7,5,0])
    let fresh_position = update_position(position, [1,7,0])

    let selector_position = update_position(position, [1,6,0]);
    let stats_position = update_position(position, [10,2,3])

    let total_teams = team_ids.length;


    
    let label = cur_in_team ? "remove piece " : "add piece "


    console.log(piece_positions)

    return (
        <>
            <group position={position}>
                <Selector position={selector_position} total={total_teams} label ="team" cur={cur_team} next={()=>set_team(cur_team+1)} prev={()=> set_team(cur_team-1)}/>
                <Button position = {fresh_position} label={"create empty team"} onClick={() => create_team(signer)}/>
                <Button position = {create_position} label={"create starter team"} onClick={() => create_starter_team(signer)}/>

                <Button position = {mint_position} label={"mint piece"} onClick={() => mint_piece(signer)}/>

                <Button position = {add_position} label={ label + cur_piece + " to team " + cur_team }
                            onClick = {button_clicked}/>
                <Team position={position} piece_ids={team_piece_ids} components={components} 
                        piece_positions= {piece_positions} set_piece={set_piece} set_is_team={set_is_team}/>
                <Pieces pieceComponent={components.Piece}
                        piece_ids={available_ids} position = {pieces_position}
                        set_piece = {set_piece} set_is_team={set_is_team}/>
                {cur_piece != 0 && <PieceStats position = {stats_position} id={cur_piece} components={components} />}
            </group>
        </>
    )
}

export default TeamBuilder;