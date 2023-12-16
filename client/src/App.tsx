import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
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
        setup: {
            systemCalls,
            components,
        },
        account,
    } = useDojo();

    const signer = account.account;
   
    const gameId = getEntityIdFromKeys([BigInt(0)]) as Entity

    return (
        <>
            <Canvas style={{height:800, width:800}}camera={{rotation:[0,0,0], position:[0,10,20] }}>
            <OrbitControls/>
                <Suspense>
                <Physics >
                    <Burners position={[5,10,10]} account = {account}/>

                    <AccRender position={[0,10,10]} address={signer.address} />

                    <Scene components={components} systemCalls={systemCalls} signer = {signer}/>

                </Physics>
                </Suspense>
            </Canvas>
        </>
    );
}

export default App;
