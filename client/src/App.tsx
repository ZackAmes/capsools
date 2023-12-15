import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { useDojo } from "./DojoContext";
import { getEntityIdFromKeys } from "@dojoengine/utils";

import {Canvas} from "@react-three/fiber";
import {Physics} from "@react-three/rapier";
import { Suspense } from "react";

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
            <Canvas style={{height:800, width:800}}camera={{rotation:[0,0,0], position:[0,5,30] }}>
                <Suspense>
                <Physics>
                    <mesh position = {[0,7,5]} onClick={() => spawn(account)}>
                        <planeGeometry/>
                        <meshBasicMaterial color = "red"/>
                    </mesh>
                    <mesh scale = {5} onClick={() => set_secret(account, 200)}>
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
