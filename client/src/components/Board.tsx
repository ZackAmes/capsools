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

    //Create Id and Value arrays
    for(let i=0; i<3; i++){
        let tempIds = [];
        let tempSquares = []
        for(let j=0; j<3; j++){
            let tempId = getEntityIdFromKeys([BigInt(game_id), BigInt(i), BigInt(j)]) as Entity 
            let tempSquare = useComponentValue(components.Square, tempId)
            tempIds.push(tempId)
            tempSquares.push(tempSquare)
        }
        squareIds.push(tempIds);
        squareValues.push(tempSquares)
    }

    //create refs and squares
    const refs: RefObject<RapierRigidBody>[] = [];
    const squares = squareValues.flat().map( (square, index) => {
        let ref = useRef<RapierRigidBody>(null);
        refs.push(ref);
        let x = square?.x;
        let y = square?.y;
        let color = (x%2===0 && y%2===0) || (x%2===1 && y%2===1) ? "blue" : "red"
        let tempPosition: [number, number, number] = [x, 0, y];
        return (<Square key={squareIds.flat()[index]} ref={ref} 
                        position={tempPosition} color= {color} 
                        state={square?.value} onClick={() => take_turn(signer, game_id, x, y)}/>);
    })

    //TODO: CLEAN UP
    const joints = [];

    //create joints                            axis :[x,y,z]  ?????????????????????????????
    //vertical
    const joint1 = useFixedJoint(refs[0], refs[1] , [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
    const joint2 = useFixedJoint(refs[1], refs[2] , [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);

    const joint3 = useFixedJoint(refs[3], refs[4], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
    const joint4 = useFixedJoint(refs[4], refs[5], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);


    const joint5 = useFixedJoint(refs[6], refs[7], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
    const joint6 = useFixedJoint(refs[7], refs[8], [[0,1,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);

    //horizontal
    const joint7 = useFixedJoint(refs[0], refs[3] , [[1,0,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
    const joint8 = useFixedJoint(refs[3], refs[6] , [[1,0,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);

    const joint9 = useFixedJoint(refs[1], refs[4], [[1,0,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
    const joint10 = useFixedJoint(refs[4], refs[7], [[1,0,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);


    const joint11 = useFixedJoint(refs[2], refs[5], [[1,0,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);
    const joint12 = useFixedJoint(refs[5], refs[8], [[1,0,0], [0,0,0,1], [0,0,0], [0,0,0,1]]);





    return (
        <>
            
            <group position={position}>
                {game && <AccRender address={"0x" + game.player_one.toString(16)} position={[0, 0, -2]} />}
                {game && <AccRender address={"0x" + game.player_two.toString(16)} position={[2, 0, -2]} />}
                {squares}
            </group>
        </>
    )
}

export default Board;