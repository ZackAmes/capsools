import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { useDojo } from "./DojoContext";
import { getEntityIdFromKeys } from "@dojoengine/utils";

import {Canvas} from "@react-three/fiber";
import {Physics} from "@react-three/rapier";
import { Suspense } from "react";
import { FlyControls } from "@react-three/drei";

import AccRender from "./components/AccRender";
import Burners from "./components/Burners";
import Button from "./components/Button";
import Scene from "./components/Scene";

function App() {
    const {
        setup: {
            systemCalls: { spawn, set_secret },
            components: { Secret, Square, Game },
        },
        account: {
            create,
            list,
            select,
            account,
            isDeploying,
            clear,
            copyToClipboard,
            applyFromClipboard,
        },
    } = useDojo();

    // entity id we are syncing
    const entityId = getEntityIdFromKeys([BigInt(account.address)]) as Entity;

    // get current component values
    const secret = useComponentValue(Secret, entityId);

    const squareIds = [];
    const squareValues = [];

    for(let i=0; i<3; i++){
        let tempIds = [];
        let tempSquares = []
        for(let j=0; j<3; j++){
            let tempId = getEntityIdFromKeys([BigInt(0), BigInt(i), BigInt(j)]) as Entity 
            let tempSquare = useComponentValue(Square, tempId)
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
            <FlyControls/>
                <Suspense>
                <Physics debug>
                    <AccRender position={[0,10,10]} account={account} click={() => console.log(account.address)}/>
                    <Burners position={[5,10,10]} create={create} clear={clear} select={select} list={list}/>
                    <Button position = {[0,7,5]} click={() => spawn(account)} label = "spawn"/> 

                    <mesh scale = {3} position={[4,5,0]} onClick={() => set_secret(account, 200)}>
                        <sphereGeometry/>
                        <meshBasicMaterial color = {secret ? getColor(secret.value) : "black"}/>
                    </mesh>

                    <Scene/>

                </Physics>
                </Suspense>
            </Canvas>
        </>
    );
}

export default App;
