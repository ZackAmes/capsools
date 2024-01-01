import { FC } from "react";
import Square from "./Square";
import { useRef, RefObject } from "react";
import { RapierRigidBody, useFixedJoint } from "@react-three/rapier";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { Account } from "starknet";
import AccRender from "./AccRender";
import { getComponentValue } from "@dojoengine/recs";
import { RigidBody } from "@react-three/rapier";
import Piece from "./Piece";
import update_position from "../utils/update_position";
import { Ref } from "react";
interface BoardProps {
    position: [number,number,number]
    game_id:number
    signer: Account
    components: any
    piece_ids:any[]
   // take_turn: (signer:Account, game_id:number, x:number, y:number) => any
}

const Board: FC<BoardProps> = ({position, game_id, piece_ids, components, signer}) => {

    let game = useComponentValue(components.Game, getEntityIdFromKeys([BigInt(game_id)]) as Entity);

    let squareValues: any[] = [];

    let refs:Ref<RapierRigidBody>[] =[];
    //Create Id and Value arrays
    for(let i=0; i<144; i++){
        squareValues.push(i);
        refs.push(useRef<RapierRigidBody>(null!));
    }


    

    let one_piece_ids: number[] = Object.values(game?.team_one.pieces);
    let two_piece_ids: number[] = Object.values(game?.team_one.pieces);
    let one_pieces = [];
    let two_pieces = [];

    //Create Id and Value arrays
    for(let i=0; i<game?.team_one.piece_count; i++){
        let tempId = getEntityIdFromKeys([BigInt(one_piece_ids[i])]) as Entity 
        let tempPiece = useComponentValue(components.Piece, tempId)
        one_pieces.push(tempPiece)
    }

    for(let i=0; i<game?.team_two.piece_count; i++){
        let tempId = getEntityIdFromKeys([BigInt(two_piece_ids[i])]) as Entity 
        let tempPiece = useComponentValue(components.Piece, tempId)
        two_pieces.push(tempPiece)
    }

    piece_ids = one_piece_ids.concat(two_piece_ids);
    let pieces = piece_ids.map( (piece_id) => {
        let piece = getComponentValue(components.Piece, piece_id);
        if(piece){
            let piece_position: [number, number, number] = update_position(position, [piece.data.position.x, 2.1, piece.data.position.y]);
            return (<Piece key={piece.id} position={piece_position} type={piece.data.piece_type} onClick={() => console.log(piece?.id)}/>)
        }    
    })

    //create refs and squares
    const squares = squareValues.flat().map( (index) => {
        let ref = useRef<RapierRigidBody>(null);
        refs.push(ref);
        let x = index % 12;
        let y = Math.floor(index/12);
        let color = x%2==y%2 ? "blue" : "red"
        let tempPosition: [number, number, number] = [x, 0, y];
        return (<Square key={index} ref={ref} 
                        position={tempPosition} color= {color} 
                        onClick={() => console.log("(" + x + "," + y + ")")}/>);
    })




    return (
        <>
            
            <group position={position}>
                {game && <AccRender address={"0x" + game.player_one.toString(16)} position={[0, 0, -2]} />}
                {game && <AccRender address={"0x" + game.player_two.toString(16)} position={[2, 0, -2]} />}
                {squares}
                {pieces}
            </group>
        </>
    )
}

export default Board;