import { FC } from "react";
import Square from "./Square";
import { useRef, RefObject } from "react";
import { RapierRigidBody, useFixedJoint } from "@react-three/rapier";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { Account } from "starknet";
import AccRender from "./AccRender";

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

    let game = useComponentValue(components.Game, getEntityIdFromKeys([BigInt(game_id)]) as Entity);

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
            let tempPosition: [number, number, number] = [position[0] + x, position[1], position[2]+y];
            return (<Square key={squareIds.flat()[index]} ref={ref} 
                            position={tempPosition} color= {color} 
                            state={square.value} onClick={() => take_turn(signer, game_id, x, y)}/>);
        }
    })



    //TODO: FIX SPINNING && FIGURE OUT HOW JOINTS WORK
    if(refs.length > 0){
        const joint1 = useFixedJoint(refs[0], refs[1] , [[1,0,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
        const joint2= useFixedJoint(refs[1], refs[2] , [[1,0,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);

        const joint3 = useFixedJoint(refs[0], refs[3], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
        const joint4 = useFixedJoint(refs[3], refs[6], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);

        const joint5 = useFixedJoint(refs[1], refs[4], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
        const joint6 = useFixedJoint(refs[4], refs[7], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);


        const joint7 = useFixedJoint(refs[2], refs[5], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
        const joint8 = useFixedJoint(refs[5], refs[8], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
    }


    return (
        <>
            {game && <AccRender address={"0x" + game.player_one.toString(16)} position={[position[0]-1, position[1], position[2] - 2]} />}
            {game && <AccRender address={"0x" + game.player_two.toString(16)} position={[position[0]+1, position[1], position[2] - 2]} />}

            <group>
                {squares}
            </group>
        </>
    )
}

export default Board;