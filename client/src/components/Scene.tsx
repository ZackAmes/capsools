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
            <Box rotation={[0, 0,0]} args={[100, 1, 100]}>
                <CuboidCollider rotation={[0, 0,0]} args={[50,.5,50]}/>
                <meshBasicMaterial color="black"/>
            </Box>
            <Square color="red" position = {[0,5,0]}/>
            <Board position={[0,3,0]} squareValues={squareValues}/>
        </>
    )
}

export default Scene;