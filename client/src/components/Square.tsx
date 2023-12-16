import { Box } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { forwardRef, Ref, FC } from "react";
import Piece from "./Piece";


interface SquareProps {
    color: string
    position: [number, number, number]
    index?: [number, number, number] 
    state: number 
    onClick: () => any
}

const Square = forwardRef(({color, position, state, onClick, index=position}: SquareProps, ref:Ref<RapierRigidBody>) => {
    
    return (
        <>
            <RigidBody rotation={[Math.PI/2,0,0]} ref={ref} position={position}>
                <Box onClick={onClick} args={[1,1,.1]}>
                    <meshBasicMaterial color={color}/>
                </Box>
            </RigidBody>
            {state>0 && <Piece position={[position[0], position[1] + .5, position[2]]} type={state}/>}
        </>
    )
})

export default Square;