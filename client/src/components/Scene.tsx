import { CuboidCollider } from "@react-three/rapier";
import {Box} from "@react-three/drei";
import { FC } from "react";
import Square from "./Square";
import Board from "./Board";
import { Account } from "starknet";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Entity } from "@dojoengine/recs";
import Secret from "./Secret";
import Button from "./Button";
import Piece from "./Piece";

interface SceneProps {
    components: any
    signer: Account
    systemCalls: any
}

const Scene: FC<SceneProps> = ({components, signer, systemCalls}) => {
    const entityId = getEntityIdFromKeys([BigInt(signer.address)]) as Entity;

    let {spawn, set_secret, take_turn} = systemCalls;

    return (
        <>
            <Box rotation={[0, 0,0]} args={[100, 1, 100]}>
                <CuboidCollider rotation={[0, 0,0]} args={[50,.5,50]}/>
            </Box>
            <Piece position = {[5,5,0]} type={1}/>
            <Board signer={signer} take_turn={take_turn} position={[0,3,0]} game_id={0} components={components}/>

            <Button scale={30} position = {[0,10,-50]} onClick={() => spawn(signer)} label = "spawn"/> 
            <Secret position={[10,5,0]} onClick = {() => set_secret(signer, 200)} components={components} signer={signer} />
        </>
    )
}

export default Scene;