import { CuboidCollider } from "@react-three/rapier";
import {Box} from "@react-three/drei";
import { FC, useState } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { getComponentValue } from "@dojoengine/recs";
import Piece from "../components/Piece";
import Button from "../components/Button";



interface PiecesProps {
    setup: {
        components: any,
        systemCalls: any
    }
    account: any
    piece_ids: any[]
    position: [number, number, number]
    set_piece: any
}

const Pieces: FC<PiecesProps> = ({setup: {components, systemCalls}, account, piece_ids, position, set_piece}) => {

    const signer = account.account;

    let {create_piece, add_piece_to_team} = systemCalls;


    let pieces = piece_ids.map( (piece_id, index) => {

        let piece = getComponentValue(components.Piece, piece_id);
        let grid_size = 5;
        console.log(piece);
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
                <Box rotation={[0, 0,0]} args={[30, 1, 30]}>
                    <CuboidCollider rotation={[0, 0,0]} args={[15,.5,15]}/>
                    <meshBasicMaterial color="grey"/>
                </Box>
                {pieces}
            </group>
        </>
    )
}

export default Pieces;