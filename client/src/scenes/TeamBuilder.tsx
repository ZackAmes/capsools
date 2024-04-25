import { FC, useState } from "react";
import { getComponentValue, Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";

import TeamRender from "../components/TeamRender";
import Pieces from "./Pieces";
import Button from "../components/Button";
import Selector from "../components/Selector";
import PieceStats from "../components/PieceStats";

import {update_position, get_ids} from "../utils/index";

interface TeamsProps {
    setup: {
        contractComponents: any,
        systemCalls: any
    }
    account: any
    counts: any
    position: [number, number, number]
}

const TeamBuilder: FC<TeamsProps> = ({setup: {contractComponents, systemCalls}, account, counts, position}) => {

    const signer = account.account;
    const {add_piece_to_team, create_team, mint_piece, starter_team, remove_piece_from_team} = systemCalls;

    const [cur_team, set_team] = useState(0);
    const [cur_piece, set_piece] = useState(0);
    const [cur_in_team, set_is_team] = useState(false);

    let {Manager, Team, Piece} = contractComponents;


    const piece_ids = get_ids(Manager, signer.address, counts.piece_count as number, "piece");
    const team_ids = get_ids(Manager, signer.address, counts.team_count as number, "team");

    let team = useComponentValue(Team , team_ids[cur_team]);

    let team_piece_ids: Entity[] = [];

    let available_ids = [];
    let piece_keys: number[];
    let piece_positions: any[] = [];
    let button_clicked= () => {};

    for(let i=0; i<piece_ids.length; i++) {
        let piece = getComponentValue(Piece, piece_ids[i]);
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
                let piece = getComponentValue(Piece, id);
                if(piece){
                    piece_positions.push({x:piece.data.position.x, y:piece.data.position.y, type: piece.data.base_stats.type_id, id: piece.id, color: piece.data.base_stats.color})
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

    let total_teams = team_ids.length;
    
    let label = cur_in_team ? "remove piece " : "add piece "


    console.log(piece_positions)

    return (
        <>
            <group position={position}>
                <Selector position={[1,6,0]} total={total_teams} label ="team" cur={cur_team} next={()=>set_team(cur_team+1)} prev={()=> set_team(cur_team-1)}/>
                <Button position = {[1,7,0]} label={"create empty team"} onClick={() => create_team(signer)}/>
                <Button position = {[1,4,0]} label={"create starter team"} onClick={() => starter_team(signer)}/>

                <Button position = {[-7,5,0]} label={"mint piece"} onClick={() => mint_piece(signer)}/>

                <Button position = {[3,2,0]} label={ label + cur_piece + " to team " + cur_team }
                            onClick = {button_clicked}/>
                <TeamRender position={[0,0,0]} piece_ids={team_piece_ids} components={contractComponents} 
                        piece_positions= {piece_positions} set_piece={set_piece} set_is_team={set_is_team}/>
                <Pieces pieceComponent={Piece}
                        piece_ids={available_ids} position = {[0,0,3]}
                        set_piece = {set_piece} set_is_team={set_is_team}/>
                {cur_piece != 0 && <PieceStats position = {[10,2,3]} id={cur_piece} components={contractComponents} />}
            </group>
        </>
    )
}

export default TeamBuilder;
