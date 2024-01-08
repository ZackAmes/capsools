import { usePrismaticJoint, RapierRigidBody } from "@react-three/rapier";
import { useRef} from "react";
import Square from "../components/Square";
import { Attractor } from "@react-three/rapier-addons";


const SlidingBoard = () => {

    let side_len = 8;
    let square_refs = [];
    for(let i=0; i<side_len**2; i++) {
          let ref = useRef<RapierRigidBody>(null!);
          square_refs.push(ref);
    }

    //make joints horizonally and vertically
    // horizontal: [x], [x+1] for x < side_len - 1
    // vertical: [y], [y+1], for y < side_len -1
    // x = index % side_len
    // y = Math.floor(index / side_len)
    // index = x + (y * side_len) 

    let joints = [];
    for(let i=0; i<square_refs.length; i++) { 
      let x = i % side_len;
      let y = Math.floor(i / side_len);

      //horizontal joints
      if(x < side_len - 1){
        let joint = usePrismaticJoint(square_refs[i], square_refs[i+1], [
          // Position of the joint in bodyA's local space
          //center of left square's right face
          [1,.5,.5],
          // Position of the joint in bodyB's local space
          //center of right square's left face
          [0,.5,.5],
          // Axis of the joint, expressed in the local-space of
          // the rigid-bodies it is attached to. Cannot be [0,0,0].
          //y-axis
          [0,1,0],
          //distance it can slide (0 to .5)
          [0,.5]
        ])
        joints.push(joint);
      }
      if(y < side_len - 1) {
        let joint = usePrismaticJoint(square_refs[i], square_refs[i+side_len], [
          // Position of the joint in bodyA's local space
          //center of north square's south face
          [.5,.5,1],
          // Position of the joint in bodyB's local space
          //center of south square's north face
          [.5,.5,0],
          // Axis of the joint, expressed in the local-space of
          // the rigid-bodies it is attached to. Cannot be [0,0,0].
          //y-axis
          [0,1,0],
          //distance it can slide (0 to .5)
          [0,.5]
        ])
      }
      
    }
    
    let squares = square_refs.map((ref, index) => {
      let x = index % side_len;
      let y = Math.floor(index / side_len);

      let color = x%2==y%2 ? "red" : "blue"
      return (
        <group position={[x,3,y]}>

          <Attractor range={.5} strength={2} />
          <Square ref={ref} position={[0,0,0]} color={color} onClick={() => console.log(index)} depth={1}/>
          
        </group>
      )
    })
    
    return (
        <>
      <group>
        {squares}
        
      </group>

      </>
      
    );
  };

  export default SlidingBoard;