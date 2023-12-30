
import { FC} from "react";
import { getComponentValue } from "@dojoengine/recs";
import Piece from "../components/Piece";



interface PiecesProps {
    pieceComponent: any
    piece_ids: any[]
    position: [number, number, number]
    set_piece: any
}

const Pieces: FC<PiecesProps> = ({pieceComponent, piece_ids, position, set_piece}) => {



    let pieces = piece_ids.map( (piece_id, index) => {

        let piece = getComponentValue(pieceComponent, piece_id);
        let grid_size = 5;
        if(piece){
            let id = piece.id
            return (
                <Piece key={id} position={[index % grid_size, 1.5, Math.floor(index / grid_size)]}
                 type = {piece.data.piece_type} onClick = {() => set_piece(id)}/>
            )
        }

    })

    return (
        <>
            <group position={position}>
                {pieces}
            </group>
        </>
    )
}

export default Pieces;