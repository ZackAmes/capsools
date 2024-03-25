import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";

import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";

import { get_ids } from "./utils/index";

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
            <Canvas>

            </Canvas>
        </>
    );

}

export default App;
