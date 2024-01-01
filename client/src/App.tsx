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
import GameManager from "./scenes/GameManager";
import Challenge from "./components/Challenge";

function App() {
    const {
        setup,
        account,
    } = useDojo();
   
    const signer = account.account;
    const playerId = getEntityIdFromKeys([BigInt(signer.address)]) as Entity
    const setId= getEntityIdFromKeys([BigInt(0)]) as Entity
    const player = useComponentValue(setup.components.Player, playerId);
    const set = useComponentValue(setup.components.SetManager, setId);

    const player_pieces_count = player?.counts.piece_count as number;
    const player_games_count = player?.counts.game_count as number;
    const player_teams_count = player?.counts.team_count as number;

    const challenge_count = set?.challenge_count as number;
    console.log(challenge_count)

    const piece_ids = get_ids(setup.components.Manager, signer.address, player_pieces_count, "piece");
    const game_ids = get_ids(setup.components.Manager, signer.address, player_games_count, "game");
    const team_ids = get_ids(setup.components.Manager, signer.address, player_teams_count, "team");
    const challenge_ids = get_ids(setup.components.Manager, 0, challenge_count, "challenge")

    const {mint_piece, new_player, create_challenge, accept_challenge} = setup.systemCalls;

    console.log(challenge_ids);

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

                    <Challenge  position = {[-5,5,0]} pending_games={challenge_ids}  components={setup.components}
                                team_ids = {team_ids} signer={account.account}
                                create_challenge={create_challenge} accept_challenge={accept_challenge}/>

                    <Burners position={[5,10,10]} account = {account}/>

                    <AccRender position={[0,10,10]} address={account.account.address} />

                    {player && <Button position={[0,5,0]} label="mint" onClick={() => mint_piece(account.account)}/>}
                    {!player && <Button position={[0,5,0]} label="new" onClick={() => new_player(account.account)}/>}

                    <TeamBuilder position = {[2,.25,0]} setup={setup} account={account} piece_ids={piece_ids} team_ids={team_ids}/>
                    {game_ids.length > 0 && 
                        <GameManager position={[-5,.3,0]} setup={setup} account={account} game_ids={game_ids} />
                    }
                </Physics>
                </Suspense>
            </Canvas>
        </>
    );
}

export default App;
