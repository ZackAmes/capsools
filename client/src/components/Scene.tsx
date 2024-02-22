import { Plane, Box } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { RigidBody, Physics, CuboidCollider } from "@react-three/rapier"
import { FC, Suspense } from "react"

interface SceneProps {

}

const Scene: FC<SceneProps>  = () => {


    return (
        <>
            <Box rotation={[0, 0,0]} args={[30, 1, 30]}>
                <CuboidCollider rotation={[0, 0,0]} args={[15,.5,15]}/>
                <meshBasicMaterial color="black"/>
            </Box>

            <RigidBody>
                <Box position={[0,1,0]}>
                    <meshBasicMaterial color="blue" />
                </Box>
            </RigidBody>
        </>
    )
}

export default Scene;