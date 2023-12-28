import { CuboidCollider } from "@react-three/rapier";
import {Box} from "@react-three/drei";
import { FC } from "react";
import Secret from "../components/Secret";
import Button from "../components/Button";
import Challenge from "../components/Challenge";
import Games from "../components/Games";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Entity, getComponentValue } from "@dojoengine/recs";
import Piece from "../components/Piece";



interface PiecesProps {
    setup: {
        components: any,
        systemCalls: any
    }
    account: any
    pieces_count: number
    position: [number, number, number]
}

const Pieces: FC<PiecesProps> = ({setup: {components, systemCalls}, account, pieces_count, position}) => {

    const signer = account.account;

    let {create_piece} = systemCalls;

    const piece_ids = [];

    for(let i=0; i<pieces_count; i++){
        let manager_id = getEntityIdFromKeys([BigInt(signer.address),BigInt(1),BigInt(i)])
        let piece_manager = getComponentValue(components.Manager, manager_id);


        let piece_id = getEntityIdFromKeys([BigInt(piece_manager?.id)]);
        piece_ids.push(piece_id);
    }
    console.log(piece_ids);

    let pieces = piece_ids.map( (piece_id, index) => {

        let piece = getComponentValue(components.Piece, piece_id);
        let grid_size = 5;
        console.log(piece);
        if(piece){
            return (
                <Piece key={piece.id} position={[index % grid_size, 1.5, Math.floor(index / grid_size)]} type = {1}/>
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