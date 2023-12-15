import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { useDojo } from "./DojoContext";
import { getEntityIdFromKeys } from "@dojoengine/utils";

import {Canvas} from "@react-three/fiber";
import {Physics} from "@react-three/rapier";
import { Suspense } from "react";

import AccRender from "./components/AccRender";
import Burners from "./components/Burners";
import Button from "./components/Button";

function App() {
    const {
        setup: {
            systemCalls: { spawn, set_secret },
            components: { Secret },
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

    const getColor = (value: number) => {
        return "rgb(0," + ((value+53)*28) % 255 + ",0)" 
    }

    return (
        <>
            <Canvas style={{height:800, width:800}}camera={{rotation:[0,0,0], position:[0,5,15] }}>
                <Suspense>
                <Physics>
                    <AccRender coords={[0,5,5]} account={account} click={() => console.log(account.address)}/>
                    <Burners coords={[5,5,5]} create={create} clear={clear} select={select} list={list}/>
                    <Button coords = {[0,7,5]} click={() => spawn(account)} label = "spawn"/> 
                    <mesh scale = {3} onClick={() => set_secret(account, 200)}>
                        <sphereGeometry/>
                        <meshBasicMaterial color = {secret ? getColor(secret.value) : "black"}/>
                    </mesh>
                </Physics>
                </Suspense>
            </Canvas>
        </>
    );
}

export default App;
