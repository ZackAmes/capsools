import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";

import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";

import { Canvas } from "@react-three/fiber";
import { Physics, CuboidCollider } from "@react-three/rapier";
import { OrbitControls, Box } from "@react-three/drei";
import { Suspense } from "react";

import Burners from "./components/Burners";
import AccRender from "./components/AccRender";
import Button from "./components/Button";


import { get_ids } from "./utils/index";
import TeamBuilder from "./scenes/TeamBuilder";
import Arena from "./scenes/Arena";
import Gov from "./scenes/Gov";
import SlidingBoard from "./scenes/SlidingBoard";

function App() {
    const {
        setup,
        account,
    } = useDojo();

    // get current component values


    const signer = account.account;
    const playerId = getEntityIdFromKeys([BigInt(signer.address)]) as Entity
    const setId= getEntityIdFromKeys([BigInt(0)]) as Entity
    const player = useComponentValue(setup.contractComponents.Player, playerId);
    const set = useComponentValue(setup.contractComponents.SetManager, setId);

    let counts = player ? player.counts : {piece_count: 0, team_count:0, game_count: 0};

    let challenge_count = set?.challenge_count;

    const {mint_piece, new_player, create_challenge, starter_team, accept_challenge, create_team} = setup.systemCalls;
    console.log(counts)

    return (
        <>
            <Canvas style={{height:800, width:800}}camera={{rotation:[0,0,0], position:[0,10,20] }}>
                <OrbitControls/>
                <Suspense>
                    <Physics>

                        <Box rotation={[0, 0,0]} args={[30, 1, 30]}>
                            <CuboidCollider rotation={[0, 0,0]} args={[15,.5,15]}/>
                            <meshBasicMaterial color="grey"/>
                        </Box>

                        <Burners position={[0,10,0]} account = {account}/>

                        <AccRender label = "signer:" position={[1.5,12,0]} address={account.account.address} />

                        {!player && <Button background={"black"} scale={10} position={[0,5,0]} label="new" onClick={() => new_player(account.account)}/>}
                        
                        <Arena setup={setup} account={account} position = {[-7,1,0]} counts={counts} challenge_count={challenge_count}/>

                        <TeamBuilder position = {[4,.25,-5]} setup={setup} account={account} counts={counts}/>
                    </Physics>
                </Suspense>
            </Canvas>
        </>
    );

}

export default App;
