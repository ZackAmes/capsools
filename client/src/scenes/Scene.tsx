import { CuboidCollider } from "@react-three/rapier";
import {Box} from "@react-three/drei";
import { FC } from "react";
import Secret from "../components/Secret";
import Button from "../components/Button";
import Challenge from "../components/Challenge";
import Games from "../components/Games";

interface SceneProps {
    setup: {
        components: any,
        systemCalls: any
    }
    account: any
    game_ids: number[]
}

const Scene: FC<SceneProps> = ({setup: {components, systemCalls}, account, game_ids}) => {

    const signer = account.account;

    let {spawn, set_secret, take_turn, challenge, create_piece} = systemCalls;



    return (
        <>
            <Box rotation={[0, 0,0]} args={[100, 1, 100]}>
                <CuboidCollider rotation={[0, 0,0]} args={[50,.5,50]}/>
            </Box>

            <Button position={[-5,5,0]} onClick={() => create_piece(signer, 1)} label="create piece"/>
            <Challenge position={[-5,10,0]} list={account.list} challenge={challenge} signer = {signer}/>

            <Games game_ids={game_ids} position={[-10,0,0]} components={components} signer={signer} take_turn={take_turn} />

            <Button scale={30} position = {[0,10,-50]} onClick={() => spawn(signer)} label = "spawn"/> 
            <Secret position={[10,5,-10]} onClick = {() => set_secret(signer, 200)} components={components} signer={signer} />
        </>
    )
}

export default Scene;