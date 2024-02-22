import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";

import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

import Scene from "./components/Scene";
import Burners from "./components/Burners";
import AccRender from "./components/AccRender";
import Button from "./components/Button";

import get_ids from "./utils/get_ids";
import TeamBuilder from "./scenes/TeamBuilder";
import GameManager from "./scenes/GameManager";
import Challenge from "./components/Challenge";

function App() {
    const {
        setup: {
            systemCalls: { spawn },
            clientComponents: { SetManager },
        },
        account,
    } = useDojo();

    // entity id we are syncing
    const setId = getEntityIdFromKeys([
        BigInt(0),
    ]) as Entity;

    // get current component values

    const set = useComponentValue(SetManager, setId);

    return (
        <>
            <Canvas style={{height:800, width:800}}camera={{rotation:[0,0,0], position:[0,10,20] }}>
                <OrbitControls/>
                <Suspense>
                    <Physics>

                        <Burners position={[0,10,0]} account = {account}/>
                        <AccRender label = "signer:" position={[1.5,12,0]} address={account.account.address} />

                        <Button label={set ? (set.piece_type_count + " pieces") : "no set"} position={[0,5,0]} onClick={() => console.log(set)} />
                        
                        <Scene /> 
                    </Physics>
                </Suspense>
            </Canvas>
        </>
    );
   // <TeamBuilder position = {[2,.25,0]} setup={setup} account={account} piece_ids={piece_ids} team_ids={team_ids}/>

}

export default App;
