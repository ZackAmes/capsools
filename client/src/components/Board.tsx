import { FC } from "react";
import Square from "./Square";
import { useRef, RefObject } from "react";
import { RapierRigidBody, useFixedJoint } from "@react-three/rapier";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";

interface BoardProps {
    position: [number,number,number]
    game_id:number
    components: any
}

const Board: FC<BoardProps> = ({position, game_id, components}) => {

    const squareIds: Entity[][] = [];
    const squareValues = [];

    for(let i=0; i<3; i++){
        let tempIds = [];
        let tempSquares = []
        for(let j=0; j<3; j++){
            let tempId = getEntityIdFromKeys([BigInt(0), BigInt(i), BigInt(j)]) as Entity 
            let tempSquare = useComponentValue(components.Square, tempId)
            console.log(tempSquare)
            tempIds.push(tempId)
            tempSquares.push(tempSquare)
        }
        squareIds.push(tempIds);
        squareValues.push(tempSquares)
    }

    const refs: RefObject<RapierRigidBody>[] = [];
    const squares = squareValues.flat().map( (square, index) => {
        if(square){
            let ref = useRef<RapierRigidBody>(null);
            refs.push(ref);

            let tempPosition: [number, number, number] = [position[0] + square.x, position[1]+3, position[2]+square.y];
            return (<Square key={squareIds.flat()[index]}ref={ref} position={tempPosition} color= "blue" state={square.value}/>);
        }

    })


    return (
        <>
            <group>
                {squares}
            </group>
        </>
    )
}

export default Board;