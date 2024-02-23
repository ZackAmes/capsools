import {FC} from 'react';
import {Box} from  '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

import { getComponentValue } from '@dojoengine/recs';

import Piece from './Piece';

interface TeamRenderProps {
    position: [number,number,number]
    piece_ids: any[]
    components: any
    set_piece: any
    set_is_team: any
    piece_positions: any[]
}

const TeamRender: FC<TeamRenderProps> = ({position, components, piece_ids, piece_positions,set_is_team,  set_piece}) => {

    let clicked = () => {

    }

    console.log(piece_positions)
    
        let pieces = piece_ids.map( (piece_id, index) => {
            let piece = getComponentValue(components.Piece, piece_id);
            if(piece){
                let piece_position: [number, number, number] = [piece.data.position.x-4, 2.1, 1];
                return (<Piece key={piece.id} position={piece_position} type={piece.data.piece_type}/>)
            }    
        })
    

    let base_squares = [ 0,1,2,3,4,5,6,7,8,9,10,11];

    let squares = base_squares.map( (square, index) => {
        let y = Math.floor(square/6);
        let x = square%6;
        let color = x%2==y%2 ? "blue" : "black"
        if(piece_positions) {
            for(let i=0; i<piece_positions.length; i++) {
                if(piece_positions[i].x == x && piece_positions[i],y ==y){
                   clicked = () => {
                    set_piece(piece_positions[i].id)
                    set_is_team(true)
                    }
                }
            }    
        }
        
        return (
            <RigidBody key={index}>
                <Box  position = {[x,.5,y]} onClick = {clicked}>
                    <meshBasicMaterial color = {color}/>
                </Box>
            </RigidBody>
        )
    })
    
    return (
        <group position = {position}>
            {pieces}
            {squares}
        </group>

    )
}

export default TeamRender;