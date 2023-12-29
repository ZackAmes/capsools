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

import get_ids from "./utils/get_ids";
import Teams from "./scenes/Teams";

function App() {
    const {
        setup,
        account,
    } = useDojo();
   
    const signer = account.account;
    const playerId = getEntityIdFromKeys([BigInt(signer.address)]) as Entity

    const player = useComponentValue(setup.components.Player, playerId);
    const player_pieces_count = player?.counts.piece_count as number;
    const player_games_count = player?.counts.game_count as number;
    const player_teams_count = player?.counts.team_count as number;


    const piece_ids = get_ids(setup.components.Manager, signer.address, player_pieces_count, "piece");
    const game_ids = get_ids(setup.components.Manager, signer.address, player_games_count, "game");
    const team_ids = get_ids(setup.components.Manager, signer.address, player_teams_count, "team");



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
                    <Pieces position={[-3,0,2]} setup={setup} account={account} piece_ids={piece_ids}/>
                    <Teams position = {[5,.1,0]} setup={setup} account={account} team_ids={team_ids}/>
                </Physics>
                </Suspense>
            </Canvas>
        </>
    );
}

export default App;
