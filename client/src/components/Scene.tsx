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
import Challenge from "./Challenge";
import Games from "./Games";

interface SceneProps {
    components: any
    account: any
    systemCalls: any
}

const Scene: FC<SceneProps> = ({components, account, systemCalls}) => {

    const signer = account.account;

    const entityId = getEntityIdFromKeys([BigInt(signer.address)]) as Entity;

    let {spawn, set_secret, take_turn, challenge} = systemCalls;



    return (
        <>
            <Box rotation={[0, 0,0]} args={[100, 1, 100]}>
                <CuboidCollider rotation={[0, 0,0]} args={[50,.5,50]}/>
            </Box>

            <Challenge position={[-5,10,0]} list={account.list} challenge={challenge} signer = {signer}/>

            <Games position={[-10,0,0]} components={components} signer={signer} take_turn={take_turn} />

            <Button scale={30} position = {[0,10,-50]} onClick={() => spawn(signer)} label = "spawn"/> 
            <Secret position={[10,5,-10]} onClick = {() => set_secret(signer, 200)} components={components} signer={signer} />
        </>
    )
}

export default Scene;