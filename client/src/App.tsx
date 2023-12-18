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
import Scene from "./components/Scene";

function App() {
    const {
        setup,
        account,
    } = useDojo();
   
    const signer = account.account;
    const playerId = getEntityIdFromKeys([BigInt(signer.address)]) as Entity

    const player = useComponentValue(setup.components.Player, playerId);
    const player_games_count = player?.games_count as number;
    const player_pieces_count = player?.pieces_count as number;

    const player_game_ids = [];
    const player_piece_ids = [];

    for(let i=0; i<player_games_count; i++){
        let manager_id = getEntityIdFromKeys([BigInt(signer.address), BigInt(i)])
        let game_manager = getComponentValue(setup.components.GameManager, manager_id);

        let game_id = game_manager?.game_id as number;
        player_game_ids.push(game_id);
    }


    return (
        <>
            <Canvas style={{height:800, width:800}}camera={{rotation:[0,0,0], position:[0,10,20] }}>
            <OrbitControls/>
                <Suspense>
                <Physics >
                    <Burners position={[5,10,10]} account = {account}/>

                    <AccRender position={[0,10,10]} address={account.account.address} />

                    <Scene setup={setup} account={account} game_ids={player_game_ids}/>

                </Physics>
                </Suspense>
            </Canvas>
        </>
    );
}

export default App;
