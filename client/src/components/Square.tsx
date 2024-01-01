import { Box } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { forwardRef, Ref, FC } from "react";
import Piece from "./Piece";


interface SquareProps {
    color: string
    position: [number, number, number]
    onClick: () => any
}

const Square = forwardRef( ({color, position, onClick}: SquareProps, ref:Ref<RapierRigidBody>) => {
    
    return (
        <group position={position}>
            <RigidBody rotation={[Math.PI/2,0,0]} ref={ref}>
                <Box onClick={onClick} args={[1,1,.1]}>
                    <meshBasicMaterial color={color}/>
                </Box>
            </RigidBody>
        </group>
    )
})

export default Square;