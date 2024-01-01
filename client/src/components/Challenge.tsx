import {FC, useState} from 'react';
import AccRender from './AccRender';
import Button from './Button';
import { Account } from 'starknet';
import update_position from '../utils/update_position';
import Selector from './Selector';

interface ChallengeProps {
    pending_games: any[]
    team_ids: any[]
    signer: Account
    create_challenge: any
    accept_challenge: any
    position: [number,number,number]
}

const Challenge: FC<ChallengeProps> = ({pending_games, team_ids, signer, create_challenge, accept_challenge, position}) => {

    let [cur_team, set_team] = useState(0);
    const potential = pending_games.map( (game_id) => {
        return (
            <mesh rotation={[0,0,0]} position={position} onClick={() => accept_challenge(signer, game_id, team_ids[cur_team])}>
                <planeGeometry args={[1,1]} />
                <meshBasicMaterial color= {"rgb( + " + game_id * 74382 % 255 + ",0,0)"}/>
            </mesh>
        )
    })
    
    let button_position = update_position(position, [0,3,0]);
    let selector_position = update_position(position, [0,2,0]);
    return (
        <>
            <Selector position={selector_position} total={team_ids.length} label={cur_team} next={()=>set_team(cur_team+1)} prev={()=> set_team(cur_team-1)}/>

            <Button scale = {.75} color={"blue"} position={button_position} 
                    label={"CHALLENGE"} onClick={() => create_challenge(signer, 1)}/>
            {potential}

        </>
    )
}
export default Challenge;