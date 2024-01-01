import {FC, useState} from 'react';
import AccRender from './AccRender';
import Button from './Button';
import { Account } from 'starknet';
import update_position from '../utils/update_position';
import Selector from './Selector';
import { getComponentValue } from '@dojoengine/recs';
import { getEntityIdFromKeys } from '@dojoengine/utils';

interface ChallengeProps {
    pending_games: any[]
    team_ids: any[]
    signer: Account
    create_challenge: any
    accept_challenge: any
    components: any
    position: [number,number,number]
}

const Challenge: FC<ChallengeProps> = ({pending_games, components, team_ids, signer, create_challenge, accept_challenge, position}) => {

    let [cur_team, set_team] = useState(0);
    let team = getComponentValue(components.Team, team_ids[cur_team]);

    const potential = pending_games.map( (game_id, index) => {
        let game = getComponentValue(components.Game, game_id);
        let challenger_id = getEntityIdFromKeys([BigInt(game?.data.team_one)]);
        let challenger_team = getComponentValue(components.Team, challenger_id);

        console.log(game_id)
        console.log(game)
        let temp_position = update_position(position, [0, -index, 0]); 
        let color = index % 2 ?  "purple" : "yellow"
        let address = challenger_team ? challenger_team.owner.toString(10) : ''
        let temp_game_id = game? game.id : 0;
        let team_id = team? team.id : 0;
        console.log(temp_game_id);
        console.log(team_id);
        return (
            <AccRender key={game_id} address={address} 
                       position={temp_position} 
                       onClick={() => accept_challenge(signer, temp_game_id, team_id)}
            />
        )
    })
    
    let button_position = update_position(position, [0,3,0]);
    let selector_position = update_position(position, [0,2,0]);
    return (
        <>
            <Selector position={selector_position} total={team_ids.length} label={cur_team} next={()=>set_team(cur_team+1)} prev={()=> set_team(cur_team-1)}/>

            <Button scale = {.75} color={"blue"} position={button_position} 
                    label={"CHALLENGE"} onClick={() => create_challenge(signer, team?.id)}/>
            {potential}

        </>
    )
}
export default Challenge;