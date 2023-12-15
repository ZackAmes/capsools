import { CuboidCollider } from "@react-three/rapier";
import {Box} from "@react-three/drei";
import { FC } from "react";
import Square from "./Square";
import Board from "./Board";

interface SceneProps {
    squareValues: any[]
}

const Scene: FC<SceneProps> = ({squareValues}) => {
    return (
        <>
            <Box args={[100, 1, 100]}>
                <CuboidCollider args={[50,.5,50]}/>
                <meshBasicMaterial color="black"/>
            </Box>
            <Square color="red" position = {[10,0,1]}/>
            <Board position={[0,0,0]} squareValues={squareValues}/>
        </>
    )
}

export default Scene;