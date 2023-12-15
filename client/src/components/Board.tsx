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
        return (<Square ref={ref} position={tempPosition} color= "blue" />);

    })

    const joint = useFixedJoint(refs[0], refs[1] , [[0,0,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);

    return (
        <>
            {squares}
        </>
    )
}

export default Board;