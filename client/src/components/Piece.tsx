import { FC } from "react";
import { RigidBody } from "@react-three/rapier";
import { Cylinder } from "@react-three/drei";

interface PieceProps {
    position: [number, number, number]
    type: number
}

const getColor = (type: number) => {
    switch(type){
        case 0: return "red"
        case 1: return "purple"
        case 2: return "yellow"
        case 3: return "green"
    }
    return "blue"
}
const Piece: FC<PieceProps> = ({position, type}) => {
    return (
        <RigidBody scale = {.25} position={position}>
            <Cylinder>
                <meshBasicMaterial color={getColor(type)}/>
            </Cylinder>
        </RigidBody>
    )
}

export default Piece;