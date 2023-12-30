import { FC, useState } from "react";
import { getComponentValue } from "@dojoengine/recs";
import Team from "../components/Team";
import Pieces from "./Pieces";
import Button from "../components/Button";

import update_position from "../utils/update_position";
import { cursorTo } from "readline";


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
    const [cur_square, set_square] = useState([]);

    let team = getComponentValue(components.Team , cur_team);
    console.log(team ? team : "no team")
    let team_piece_ids: number[] = [];


    if(team) {
        let pieces_count = team.piece_count;

        let team_piece_ids = [team.piece_one, team.piece_two]
    }
    
    let pieces_position = update_position(position, [0,0,3])
    let add_position = update_position(position, [1,5,0])
    let create_position = update_position(position, [1,4,0])

    const add_piece = (x: number, y:number) => {
        add_piece_to_team(signer, cur_piece, team?.id, x, y);
    }

    return (
        <>
            <group position={position}>
                <Button position = {create_position} label={"create team"} onClick={() => create_team(signer)}/>
                {cur_piece && team && cur_square && 
                    <Button position = {add_position} label={"add " + cur_piece + " to team " + team.id}
                            onClick = {() => add_piece(cur_square[0], cur_square[1])}/>
                }
                <Team position={position} piece_ids={team_piece_ids} components={components} set_square={( () => console.log("test"))}/>
                <Pieces pieceComponent={components.Piece}
                        piece_ids={piece_ids} position = {pieces_position}
                        set_piece = {set_piece}/>
            </group>
        </>
    )
}

export default TeamBuilder;