import { CuboidCollider } from "@react-three/rapier";
import {Box} from "@react-three/drei";
import { FC, useState } from "react";
import { getComponentValue } from "@dojoengine/recs";
import Team from "../components/Team";



interface TeamsProps {
    setup: {
        components: any,
        systemCalls: any
    }
    account: any
    team_ids: any[]
    position: [number, number, number]
}

const Teams: FC<TeamsProps> = ({setup: {components, systemCalls}, account, team_ids, position}) => {

    const signer = account.account;

    const [cur_team, set_team] = useState(team_ids[0]);
    
    let team = getComponentValue(components.Team , cur_team);
    let piece_ids: number[] = [];
    
    if(team) {
        let pieces_count = team.piece_count;

        let piece_ids = [team.piece_one, team.piece_two]
    }


    return (
        <>
            <group position={position}>
                <Team position={position} piece_ids={piece_ids} components={components}/>
            </group>
        </>
    )
}

export default Teams;