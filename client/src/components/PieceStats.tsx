import { FC } from "react";
import { RigidBody } from "@react-three/rapier";
import { Cylinder } from "@react-three/drei";
import { Text } from "@react-three/drei";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";

interface PieceStatsProps {
    position: [number, number, number]
    components: any
    id: number
    onClick?: () => any
}

const getColor = (type: number) => {
    switch(type){
        case 0: return "red"
        case 1: return "purple"
        case 2: return "yellow"
        case 3: return "green"
    }
    return "blue"
}
const PieceStats: FC<PieceStatsProps> = ({components, id, position, onClick = () => console.log(id)}) => {
    console.log(id)
    let piece = getComponentValue(components.Piece, getEntityIdFromKeys([BigInt(id)]) as Entity);
    let type_id = piece?.data.piece_type;
    let stats_id = getEntityIdFromKeys([BigInt(type_id)]) as Entity
    let stats = getComponentValue(components.PieceType, stats_id)?.piece_stats;
    console.log(stats)
    let type = piece ? piece.data.piece_type : 0
    return (
        <group scale = {1.75} position={position}>
            <Text position={[0,2,0]}>
                {piece?.data.cur_hp + "/" + stats?.hp}
                <meshBasicMaterial color="black"/>
            </Text>
            <Text scale={.5} position={[-1.5,1,0]}>
                {"dmg: " + stats?.dmg}
                <meshBasicMaterial color="black"/>

            </Text>
            <Text scale={.5} position={[1.5,1,0]}>
                {"cost: " + stats?.cost}
                <meshBasicMaterial color="black"/>
            </Text>
            <Cylinder onClick={onClick} >
                <meshBasicMaterial color={getColor(type)}/>
            </Cylinder>
        </group>
    )
}

export default PieceStats;