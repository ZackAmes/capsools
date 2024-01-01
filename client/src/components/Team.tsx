import {FC} from 'react';
import {Box} from  '@react-three/drei';
import { getComponentValue } from '@dojoengine/recs';
import Piece from './Piece';
import { RigidBody } from '@react-three/rapier';

interface TeamProps {
    position: [number,number,number]
    piece_ids: any[]
    components: any
    set_square: (pos: any) => any
}

const Team: FC<TeamProps> = ({position, components, piece_ids, set_square}) => {
    
    let pieces = piece_ids.map( (piece_id) => {
        let piece = getComponentValue(components.Piece, piece_id);
        if(piece){
            let piece_position: [number, number, number] = [piece.data.position.x-4, 2.1, piece.data.position.y];
            return (<Piece key={piece.id} position={piece_position} type={piece.data.piece_type}/>)
        }    
    })

    let base_squares = [ 0,1,2,3,4,5,6,7,8,9,10,11];

    let squares = base_squares.map( (square, index) => {
        let y = Math.floor(square/6);
        let x = square%6;
        let color = x%2==y%2 ? "blue" : "black"
        return (
            <RigidBody>
                <Box key={index} position = {[x,.5,y]} onClick = {set_square([x,y])}>
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

export default Team;