import { CuboidCollider } from "@react-three/rapier";
import {Box} from "@react-three/drei";
import { FC } from "react";
import Square from "./Square";

interface SceneProps {

}

const Scene: FC<SceneProps> = () => {
    return (
        <>
            <Box args={[100, 1, 100]}>
                <CuboidCollider args={[50,.5,50]}/>
                <meshBasicMaterial color="black"/>
            </Box>
            <Square color="red" position = {[0,0,1]}/>
        </>
    )
}

export default Scene;