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
    game_ids: number[]
}

const Games: FC<GamesProps> = ({game_ids, position, signer, components, take_turn}) => {

    let entityId = getEntityIdFromKeys([BigInt(signer.address)]) as Entity;

    let player = useComponentValue(components.Player, entityId);


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