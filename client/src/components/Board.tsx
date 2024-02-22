import { FC } from "react";

import { useRef, Ref , useState} from "react";
import { RapierRigidBody} from "@react-three/rapier";

import { Account } from "starknet";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";
import { Entity, getComponentValue } from "@dojoengine/recs";

import Square from "./Square";
import Piece from "./Piece";

import get_moves from "../utils/get_moves";
import PieceStats from "./PieceStats";

interface BoardProps {
    position: [number,number,number]
    game_id:Entity
    signer: Account
    take_turn: any
    take_turn: any
    components: any
    

   // take_turn: (signer:Account, game_id:number, x:number, y:number) => any
}

const Board: FC<BoardProps> = ({position, game_id, components, signer, take_turn}) => {

    let squareValues: any[] = [];
    let piece_ids: any[] = [];
    let piece_positions: any[] = [];
    let refs:Ref<RapierRigidBody>[] =[];
    //Create Id and Value arrays
    for(let i=0; i<144; i++){
        squareValues.push(i);
        refs.push(useRef<RapierRigidBody>(null!));
    }

    let game = useComponentValue(components.Game, game_id);
    let [cur_x, set_x] = useState(0);
    let [cur_y, set_y] = useState(0);
    let [cur_is_piece, set_is_piece] = useState(false);
    let [cur_id, set_id] = useState(0);
    let initial_moves:[number, number][] = [[0,0]]
    let [cur_moves, set_moves] = useState(initial_moves);
    

    let set_cur = (x:number, y:number, clicked_is_piece: boolean, id: number = 0) => {
        if(!cur_is_piece){
            set_x(x);
            set_y(y);
            if(clicked_is_piece == true) {
                set_is_piece(true);
            }
        }
        set_x(x);
        set_y(y);
        set_moves([]);
        set_is_piece(false);

        if(clicked_is_piece){
            set_moves(get_moves(id))
        }
        else {
            if(game){
                console.log(game)
                take_turn(signer, game.id, id, x, y);
            }    
            set_x(0);
            set_y(0);
        }
        set_is_piece(clicked_is_piece)
        set_id(id)

        //else move, or attack
    }
    if(game){
        let team_one = getComponentValue(components.Team, getEntityIdFromKeys([BigInt(game.data.team_one)]) as Entity);
        let one_piece_ids:number[] = [];
        let two_piece_ids:number[] = [];
            
        if(game.data.team_two != 0) {
            let team_two = getComponentValue(components.Team, getEntityIdFromKeys([BigInt(game.data.team_two)]) as Entity);
            two_piece_ids = team_two ? Object.values(team_two.pieces) : [];
        }
        one_piece_ids= team_one ? Object.values(team_one.pieces) : [];
        console.log(two_piece_ids);

        piece_ids = one_piece_ids.concat(two_piece_ids);
    }
    
    



    console.log(piece_ids)
    let pieces = piece_ids.map( (piece_id) => {
        let piece = getComponentValue(components.Piece, getEntityIdFromKeys([BigInt(piece_id)]) as Entity);
        let piece = getComponentValue(components.Piece, getEntityIdFromKeys([BigInt(piece_id)]) as Entity);
        if(piece){
            let piece_position: [number, number, number] = [piece.data.position.x, 2.1, piece.data.position.y];
            piece_positions.push({x:piece.data.position.x, y:piece.data.position.y, type: piece.data.piece_type, id: piece.id})
            return (<Piece key={piece.id} position={piece_position} type={piece.data.piece_type}/>)
            let piece_position: [number, number, number] = [piece.data.position.x, 2.1, piece.data.position.y];
            piece_positions.push({x:piece.data.position.x, y:piece.data.position.y, type: piece.data.piece_type, id: piece.id})
            return (<Piece key={piece.id} position={piece_position} type={piece.data.piece_type}/>)
        }    
    })
    
    
    console.log(piece_positions)
    
    
    console.log(piece_positions)
    //create refs and squares
    const squares = squareValues.flat().map( (index) => {
        let ref = useRef<RapierRigidBody>(null);
        refs.push(ref);
        let x = (index % 12)+1;
        let y = (Math.floor(index/12))+1;
        let clicked = () => set_cur(x,y,false);
        let position = {x: x, y: y};
        for(let i=0; i< piece_positions.length; i++) {
            let piece_position = piece_positions[i];
            if(x==piece_position.x && y==piece_position.y){
                if(cur_x == x && cur_y == y && cur_is_piece == true) {
                    clicked = () => set_cur(0,0,false);
                }
                clicked = () => set_cur(x,y,true, piece_position.type);
            }
        }
        let color = x%2==y%2 ? "black" : "white"
        if(cur_x == x && cur_y == y && cur_is_piece == true) {
            color = "blue"
        }
        for(let i=0; i<cur_moves.length; i++) {
            if(cur_x + cur_moves[i][0] == x && cur_y + cur_moves[i][1] == y) {
                color = "green"
                clicked=() => set_cur(x,y,false)
            }
        }
        let x = (index % 12)+1;
        let y = (Math.floor(index/12))+1;
        let clicked = () => set_cur(x,y,false);
        let position = {x: x, y: y};
        for(let i=0; i< piece_positions.length; i++) {
            let piece_position = piece_positions[i];
            if(x==piece_position.x && y==piece_position.y){
                if(cur_x == x && cur_y == y && cur_is_piece == true) {
                    clicked = () => set_cur(0,0,false);
                }
                clicked = () => set_cur(x,y,true, piece_position.type);
            }
        }
        let color = x%2==y%2 ? "black" : "white"
        if(cur_x == x && cur_y == y && cur_is_piece == true) {
            color = "blue"
        }
        for(let i=0; i<cur_moves.length; i++) {
            if(cur_x + cur_moves[i][0] == x && cur_y + cur_moves[i][1] == y) {
                color = "green"
                clicked=() => set_cur(x,y,false)
            }
        }
        let tempPosition: [number, number, number] = [x, 0, y];
        return (<Square key={index} ref={ref} 
                        position={tempPosition} color= {color} 
                        onClick={clicked}/>);
                        onClick={clicked}/>);
    })

    

    




    return (
        <>
            
            <group position={position}>
                {cur_id > 0 && <PieceStats position = {[7,0,-3]} id={piece_ids[cur_id]} components={components} />}
                {squares}
                {pieces}
            </group>
        </>
    )
}

export default Board;