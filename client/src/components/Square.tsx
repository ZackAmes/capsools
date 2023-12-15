import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { FC } from "react";

interface SquareProps {
    color: string
    position: [number, number, number]
    index?: [number, number, number] 
    ref?: any
}

const Square: FC<SquareProps> = ({color, position, index=position, ref}) => {
    return (
        <>
            <RigidBody ref={ref} position={position}>
                <Box>
                    <meshBasicMaterial color={color}/>
                </Box>
            </RigidBody>
        </>
    )
}

export default Square;