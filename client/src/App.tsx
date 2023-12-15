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
import Button from "./components/Button";
import Scene from "./components/Scene";

function App() {
    const {
        setup: {
            systemCalls: { spawn, set_secret },
            components,
        },
        account,
    } = useDojo();

    // entity id we are syncing
    const signer = account.account;
    const entityId = getEntityIdFromKeys([BigInt(signer.address)]) as Entity;

    // get current component values
    const secret = useComponentValue(components.Secret, entityId);

    const squareIds = [];
    const squareValues = [];

    for(let i=0; i<3; i++){
        let tempIds = [];
        let tempSquares = []
        for(let j=0; j<3; j++){
            let tempId = getEntityIdFromKeys([BigInt(0), BigInt(i), BigInt(j)]) as Entity 
            let tempSquare = useComponentValue(components.Square, tempId)
            console.log(tempSquare)
            tempIds.push(tempId)
            tempSquares.push(tempSquare)
        }
        squareIds.push(tempIds);
        squareValues.push(tempSquares)
    }

    const gameId = getEntityIdFromKeys([BigInt(0)]) as Entity

    console.log(squareValues);

    const getColor = (value: number) => {
        return "rgb(0," + ((value+53)*28) % 255 + ",0)" 
    }

    return (
        <>
            <Canvas style={{height:800, width:800}}camera={{rotation:[0,0,0], position:[0,10,20] }}>
            <OrbitControls/>
                <Suspense>
                <Physics debug>
                    <AccRender position={[0,10,10]} account={signer} click={() => console.log(signer.address)}/>
                    <Burners position={[5,10,10]} account = {account}/>
                    <Button position = {[0,7,5]} click={() => spawn(signer)} label = "spawn"/> 

                    <mesh scale = {3} position={[4,5,0]} onClick={() => set_secret(signer, 200)}>
                        <sphereGeometry/>
                        <meshBasicMaterial color = {secret ? getColor(secret.value) : "black"}/>
                    </mesh>

                    <Scene squareValues={squareValues}/>

                </Physics>
                </Suspense>
            </Canvas>
        </>
    );
}

export default App;
