import { FC } from "react";
import Square from "./Square";
import { useRef, RefObject } from "react";
import { RapierRigidBody, useFixedJoint } from "@react-three/rapier";

interface BoardProps {
    position: [number,number,number]
    squareValues:any[]
}

const Board: FC<BoardProps> = ({position, squareValues}) => {
    const refs: RefObject<RapierRigidBody>[] = [];
    const squares = squareValues.flat().map( (square) => {

        let ref = useRef<RapierRigidBody>(null);
        refs.push(ref);

        let tempPosition: [number, number, number] = [position[0] + square.x, position[1]+3, position[2]+square.y];
        return (<Square ref={ref} position={tempPosition} color= "blue" state={square.value}/>);

    })

    const joint1 = useFixedJoint(refs[0], refs[1] , [[1,0,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
    const joint2= useFixedJoint(refs[1], refs[2] , [[1,0,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);

    const joint3 = useFixedJoint(refs[0], refs[3], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
    const joint4 = useFixedJoint(refs[3], refs[6], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);

    const joint5 = useFixedJoint(refs[1], refs[4], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
    const joint6 = useFixedJoint(refs[4], refs[7], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);


    const joint7 = useFixedJoint(refs[2], refs[5], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
    const joint8 = useFixedJoint(refs[5], refs[8], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);



    return (
        <>
            {squares}
        </>
    )
}

export default Board;