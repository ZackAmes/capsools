import { getEntityIdFromKeys } from "@dojoengine/utils";
import { FC } from "react";
import { Account } from "starknet";
import { Entity } from "@dojoengine/recs";
import { useComponentValue } from "@latticexyz/react";
import Board from "./Board";

interface GamesProps {
    position: [number, number, number]
    signer: Account
    components: any
    take_turn: any
}

const Games: FC<GamesProps> = ({position, signer, components, take_turn}) => {

    let entityId = getEntityIdFromKeys([BigInt(signer.address)]) as Entity;

    let player = useComponentValue(components.Player, entityId);

    let game_ids = [];

    if(player){

        let count:number = player.games_count as number;

        for(let i=0; i<count; i++){

            let tempId = getEntityIdFromKeys([BigInt(signer.address), BigInt(i)]) as Entity;

            game_ids.push( useComponentValue(components.GameManager, tempId)?.game_id )

        }

        console.log(game_ids)

    }

    const games = game_ids.map( (game_id, index) => {

        return (
            <Board key={game_id as number} position= {[position[0] + 5*index, position[1]+1, position[2]]} 
                   game_id={game_id as number} components={components} signer={signer} take_turn={take_turn}/>
        )
    })
    

    return (
        <>
            {games}
        </>
    )
}

export default Games;