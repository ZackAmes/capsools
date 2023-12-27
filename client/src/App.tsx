import { useComponentValue } from "@dojoengine/react";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { useDojo } from "./DojoContext";
import { getEntityIdFromKeys } from "@dojoengine/utils";

import {Canvas} from "@react-three/fiber";
import {Physics} from "@react-three/rapier";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

import AccRender from "./components/AccRender";
import Burners from "./components/Burners";
import Scene from "./scenes/Scene";
import SlidingBoard from "./scenes/SlidingBoard";
import Button from "./components/Button";

function App() {
    const {
        setup,
        account,
    } = useDojo();
   
    const signer = account.account;
    const playerId = getEntityIdFromKeys([BigInt(signer.address)]) as Entity

    const player = useComponentValue(setup.components.Player, playerId);
    const player_games_count = player?.counts.game_count as number;
    const player_pieces_count = player?.counts.piece_count as number;

    const player_game_ids = [];
    const player_piece_ids = [];

    for(let i=0; i<player_games_count; i++){
        let manager_id = getEntityIdFromKeys([BigInt(signer.address),BigInt(i)])
        let game_manager = getComponentValue(setup.components.Manager, manager_id);

        let game_id = game_manager?.id;
        player_game_ids.push(game_id);
    }

    for(let i=0; i<player_pieces_count; i++){
        let manager_id = getEntityIdFromKeys([BigInt(signer.address), BigInt(i)])
        let piece_manager = getComponentValue(setup.components.Manager, manager_id);

        let piece_id = piece_manager?.id;
        player_piece_ids.push(piece_id);

    }

    console.log(player_piece_ids)


    return (
        <>
            <Canvas style={{height:800, width:800}}camera={{rotation:[0,0,0], position:[0,10,20] }}>
            <OrbitControls/>
                <Suspense>
                <Physics >
                    <Burners position={[5,10,10]} account = {account}/>

                    <AccRender position={[0,10,10]} address={account.account.address} />

                    <Button position={[0,0,0]} label="mint" onClick={() => setup.systemCalls.mint_piece(account.account)}/>

                    <SlidingBoard/>

                </Physics>
                </Suspense>
            </Canvas>
        </>
    );
}

export default App;
