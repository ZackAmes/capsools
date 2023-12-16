import { Box } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { forwardRef, Ref, FC } from "react";
import Piece from "./Piece";


interface SquareProps {
    color: string
    position: [number, number, number]
    index?: [number, number, number] 
    state: number 
}

const Square = forwardRef(({color, position, state, index=position}: SquareProps, ref:Ref<RapierRigidBody>) => {
    let piece = (<></>);
    if(state>0){
        let piece = (<Piece position={position} type={state}/>)
    }
    

    return (
        <>
            <RigidBody ref={ref} position={position}>
                <Box args={[1,1,.1]}>
                    <meshBasicMaterial color={color}/>
                </Box>
            </RigidBody>
            {piece}
        </>
    )
})

export default Square;