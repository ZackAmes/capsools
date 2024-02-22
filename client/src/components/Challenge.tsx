import {FC, useState} from 'react';
import AccRender from './AccRender';
import Button from './Button';
import { Account } from 'starknet';
import update_position from '../utils/update_position';
import Selector from './Selector';
import { getComponentValue } from '@dojoengine/recs';
import { getEntityIdFromKeys } from '@dojoengine/utils';
import Team from './Team';
import { Entity } from '@dojoengine/recs';

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

    
    
    let button_position = update_position(position, [0,3,0]);
    let label_position = update_position(position, [0,2,0]);

    let selector_position = update_position(position, [0,1,0]);
    let team_position = update_position(position, [-4,0,-4])
    return (
        <>
            <Selector position={selector_position} total={team_ids.length} label="Team " cur={cur_team} next={()=>set_team(cur_team+1)} prev={()=> set_team(cur_team-1)}/>

            {team && <Button scale = {.75} color={"blue"} position={button_position} 
                    label={"OPEN CHALLENGE"} onClick={() => create_challenge(signer, team?.id)}/>}
            {team && <Button scale = {.75} color={"blue"} position={label_position} 
                    label={"ACCEPT CHALLENGE"} onClick={() => console.log("")}/>}
            
            <Team position={team_position} piece_ids={team_piece_ids} components={components} set_square={( () => console.log("test"))}/>

            
            {potential}

        </>
    )
}
export default Challenge;