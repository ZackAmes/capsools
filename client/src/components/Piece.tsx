import { FC } from "react";
import { RigidBody } from "@react-three/rapier";

interface PieceProps {
    position: [number, number, number]
    type: number
}

const getColor = (type: number) => {
    switch(type){
        case 1: return "blue"
    }
}
const Piece: FC<PieceProps> = ({position, type}) => {
    return (
        <RigidBody position={position}>
            <cylinderGeometry args={[1,1,.1]}/>
            <meshBasicMaterial color={getColor(type)}/>
        </RigidBody>
    )
}

export default Piece;