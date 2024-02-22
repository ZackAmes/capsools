import { Box } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { forwardRef, Ref} from "react";


interface SquareProps {
    color: string
    position: [number, number, number]
    onClick: () => any
    depth?: number
}

const Square = forwardRef( ({color, position, onClick, depth=.1}: SquareProps, ref:Ref<RapierRigidBody>) => {
    
    return (
        <group position={position}>
            <RigidBody rotation={[Math.PI/2,0,0]} ref={ref}>
                <Box onClick={onClick} args={[1,1,depth]}>
                    <meshBasicMaterial color={color}/>
                </Box>
            </RigidBody>
        </group>
    )
})

export default Square;