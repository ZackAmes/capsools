import { useComponentValue } from "@dojoengine/react";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { useDojo } from "./DojoContext";
import { getEntityIdFromKeys } from "@dojoengine/utils";

import {Canvas} from "@react-three/fiber";
import {Physics, CuboidCollider} from "@react-three/rapier";
import { Suspense } from "react";
import { OrbitControls,Box } from "@react-three/drei";


import AccRender from "./components/AccRender";
import Burners from "./components/Burners";
import SlidingBoard from "./scenes/SlidingBoard";
import Button from "./components/Button";

import get_ids from "./utils/get_ids";
import TeamBuilder from "./scenes/TeamBuilder";
import Arena from "./scenes/Arena";
import Gov from "./scenes/Gov";

function App() {
    const {
        setup,
        account,
    } = useDojo();
   
    const signer = account.account;
    const playerId = getEntityIdFromKeys([BigInt(signer.address)]) as Entity
    const setId= getEntityIdFromKeys([BigInt(0)]) as Entity
    let player = useComponentValue(setup.components.Player, playerId);
    let counts = player ? player.counts : {piece_count: 0, team_count:0, game_count: 0};
    
    let set = useComponentValue(setup.components.SetManager, setId);

    let challenge_count = set?.challenge_count;

    const {mint_piece, new_player, create_challenge, create_starter_team, accept_challenge, create_team} = setup.systemCalls;
    
    return (
        <>
            <Canvas style={{height:800, width:800}}camera={{rotation:[0,0,0], position:[0,10,20] }}>
            <OrbitControls/>
                <Suspense>
                <Physics >


                    <Box rotation={[0, 0,0]} args={[30, 1, 30]}>
                        <CuboidCollider rotation={[0, 0,0]} args={[15,.5,15]}/>
                        <meshBasicMaterial color="grey"/>
                    </Box>

                    <Burners position={[0,10,0]} account = {account}/>

                    <AccRender label = "signer:" position={[1.5,12,0]} address={account.account.address} />

                    {!player && <Button background={"black"} scale={10} position={[0,5,0]} label="new" onClick={() => new_player(account.account)}/>}
                    {
                    counts.team_count == 0 && <Button position = {[5,5,0]} label={"claim starter team"} onClick={() => create_starter_team(signer)}/>
                    }
                    <Arena setup={setup} account={account} position = {[-7,1,0]} counts={counts} challenge_count={challenge_count}/>

                    <Gov position = {[-10,10,-15]} components={setup.components} systemCalls={setup.systemCalls}
                        total = {set? set.piece_type_count : 0} signer={account.account} points={player ? player.points : 0}/>
                    {counts.team_count>0 && <TeamBuilder position = {[4,.25,-5]} setup={setup} account={account} counts={counts}/>}
                    
                </Physics>
                </Suspense>
            </Canvas>
        </>
    );
   // <TeamBuilder position = {[2,.25,0]} setup={setup} account={account} piece_ids={piece_ids} team_ids={team_ids}/>

}

export default App;
