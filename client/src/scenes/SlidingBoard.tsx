import { Box, Sphere } from "@react-three/drei";
import { usePrismaticJoint, RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { CuboidCollider } from "@react-three/rapier";





const SlidingBoard = () => {
    let bodyA = useRef<RapierRigidBody>(null!);
    let bodyB = useRef<RapierRigidBody>(null!);
    let bodyC = useRef<RapierRigidBody>(null!);

    const joint1 = usePrismaticJoint(bodyA, bodyB, [
      // Position of the joint in bodyA's local space
      [1, .5, .5],
      // Position of the joint in bodyB's local space
      [0, .5, .5],
      // Axis of the joint, expressed in the local-space of
      // the rigid-bodies it is attached to. Cannot be [0,0,0].
      [0, 1, 0],
      [0,.5]
    ]);

    const joint2 = usePrismaticJoint(bodyB, bodyC, [
        [1,.5,.5],
        [0,.5,.5],
        [0,1,0],
        [0,.5]
    ])
    
    
    return (
        <>
         <group>


        <RigidBody position={[0,3,0]}ref={bodyA}>
          <Box>
            <meshBasicMaterial color={"black"}/>
          </Box>
        </RigidBody>
        <RigidBody position={[1,3,0]}ref={bodyB}>
            <Box>
                <meshBasicMaterial color={"red"}/>
            </Box>
        </RigidBody>

        <RigidBody position={[2,3,0]}ref={bodyC}>
            <Box>
                <meshBasicMaterial color={"black"}/>
            </Box>
        </RigidBody>
        <RigidBody>
            <Sphere>
                <meshBasicMaterial color="blue" />
            </Sphere>
        </RigidBody>
      </group>

      </>
      
    );
  };

  export default SlidingBoard;