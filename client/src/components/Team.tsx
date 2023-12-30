import {FC} from 'react';
import {Box} from  '@react-three/drei';
import { getComponentValue } from '@dojoengine/recs';
import Piece from './Piece';

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
            let piece_position: [number, number, number] = [piece.data.position.x, .1, piece.data.position.y];
            return (<Piece position={piece_position} type={piece.data.piece_type}/>)
        }    
    })

    let base_squares = [ 0,1,2,3,4,5,6,7,8,9];

    let squares = base_squares.map( (square, index) => {
        let y = Math.floor(square/5);
        let x = square%5;
        let color = index % 2 == 0 ? "blue" : "black"
        return (
            <Box key={index} position = {[x,.1,y]} onClick = {set_square([x,y])}>
                <meshBasicMaterial color = {color}/>
            </Box>
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