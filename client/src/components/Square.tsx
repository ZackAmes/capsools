import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { FC } from "react";

interface SquareProps {
    color: string
    position: [number, number, number]
}

const Square: FC<SquareProps> = ({color, position}) => {
    return (
        <>
            <RigidBody position={position}>
                <Box>
                    <meshBasicMaterial color={color}/>
                </Box>
            </RigidBody>
        </>
    )
}

export default Square;