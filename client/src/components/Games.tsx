import { getEntityIdFromKeys } from "@dojoengine/utils";
import { FC } from "react";
import { Account } from "starknet";
import { Entity } from "@dojoengine/recs";
import { useComponentValue } from "@latticexyz/react";

interface GamesProps {
    signer: Account
    components: any
}

const Games: FC<GamesProps> = ({signer, components}) => {

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
    

    return (
        <>
        
        
        
        
        
        
        </>
    )
}

export default Games;