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
import SlidingBoard from "./scenes/SlidingBoard";
import Button from "./components/Button";
import Pieces from "./scenes/Pieces";

function App() {
    const {
        setup,
        account,
    } = useDojo();
   
    const signer = account.account;
    const playerId = getEntityIdFromKeys([BigInt(signer.address)]) as Entity

    const player = useComponentValue(setup.components.Player, playerId);
    const player_pieces_count = player?.counts.piece_count as number;



    return (
        <>
            <Canvas style={{height:800, width:800}}camera={{rotation:[0,0,0], position:[0,10,20] }}>
            <OrbitControls/>
                <Suspense>
                <Physics >
                    <Burners position={[5,10,10]} account = {account}/>

                    <AccRender position={[0,10,10]} address={account.account.address} />

                    {player && <Button position={[0,5,0]} label="mint" onClick={() => setup.systemCalls.mint_piece(account.account)}/>}
                    {!player && <Button position={[0,5,0]} label="new" onClick={() => setup.systemCalls.new_player(account.account)}/>}

                    <SlidingBoard/>
                    <Pieces position={[-3,0,2]} setup={setup} account={account} pieces_count={player_pieces_count}/>

                </Physics>
                </Suspense>
            </Canvas>
        </>
    );
}

export default App;
