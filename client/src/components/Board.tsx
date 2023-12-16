import { FC } from "react";
import Square from "./Square";
import { useRef, RefObject } from "react";
import { RapierRigidBody, useFixedJoint } from "@react-three/rapier";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { Account } from "starknet";

interface BoardProps {
    position: [number,number,number]
    game_id:number
    signer: Account
    components: any
    take_turn: (signer:Account, game_id:number, x:number, y:number) => any
}

const Board: FC<BoardProps> = ({position, game_id, components, take_turn, signer}) => {

    const squareIds: Entity[][] = [];
    const squareValues = [];

    for(let i=0; i<3; i++){
        let tempIds = [];
        let tempSquares = []
        for(let j=0; j<3; j++){
            let tempId = getEntityIdFromKeys([BigInt(0), BigInt(i), BigInt(j)]) as Entity 
            let tempSquare = useComponentValue(components.Square, tempId)
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
            let x = square.x;
            let y = square.y;
            let color = (x%2===0 && y%2===0) || (x%2===1 && y%2===1) ? "blue" : "red"
            let tempPosition: [number, number, number] = [position[0] + x, position[1]+3, position[2]+y];
            return (<Square key={squareIds.flat()[index]} ref={ref} 
                            position={tempPosition} color= {color} 
                            state={square.value} onClick={() => take_turn(signer, game_id, x, y)}/>);
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