import { Box } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { forwardRef, Ref } from "react";


interface SquareProps {
    color: string
    position: [number, number, number]
    index?: [number, number, number] 
}

const Square = forwardRef(({color, position, index=position}: SquareProps, ref:Ref<RapierRigidBody>) => {
    return (
        <>
            <RigidBody ref={ref} position={position}>
                <Box>
                    <meshBasicMaterial color={color}/>
                </Box>
            </RigidBody>
        </>
    )
})

export default Square;