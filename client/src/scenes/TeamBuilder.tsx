import { FC, useState } from "react";
import { getComponentValue } from "@dojoengine/recs";
import Team from "../components/Team";
import Pieces from "./Pieces";
import Button from "../components/Button";

import update_position from "../utils/update_position";


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
    const {add_piece_to_team, create_team} = systemCalls;

    const [cur_team, set_team] = useState(team_ids[0]);
    const [cur_piece, set_piece] = useState();
    
    let team = getComponentValue(components.Team , cur_team);
    console.log(team)
    let team_piece_ids: number[] = [];


    if(team) {
        let pieces_count = team.piece_count;

        let team_piece_ids = [team.piece_one, team.piece_two]
    }
    
    let pieces_position = update_position(position, [0,0,3])
    let add_position = update_position(position, [1,5,0])
    let create_position = update_position(position, [1,4,0])
    return (
        <>
            <group position={position}>
                <Button position = {create_position} label={"create team"} onClick={() => create_team(signer)}/>
                {cur_piece && team && <Button position = {add_position} label={"add " + cur_piece + " to team " + team.id}
                        onClick = {() => add_piece_to_team(signer, cur_piece, team?.id)}/>}
                <Team position={position} piece_ids={team_piece_ids} components={components}/>
                <Pieces setup={{components, systemCalls}} account={account}
                        piece_ids={piece_ids} position = {pieces_position}
                        set_piece = {set_piece}/>
            </group>
        </>
    )
}

export default TeamBuilder;