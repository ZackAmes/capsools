import { FC } from "react";
import { RigidBody } from "@react-three/rapier";
import { Cylinder } from "@react-three/drei";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useState } from "react";
import Selector from "../components/Selector";
import Button from "../components/Button";
import { Account } from "starknet";
import { Text } from "@react-three/drei";
interface GovProps {
    position: [number, number, number]
    components: any
    onClick?: () => any
    points: number
    total: number
    systemCalls: any
    signer: Account
}

const getColor = (type: number) => {
    switch(type){
        case 0: return "red"
        case 1: return "purple"
        case 2: return "yellow"
        case 3: return "green"
    }
    return "rgb(" + (type + 17) * 243 % 255 +",50,50)"
}
const Gov: FC<GovProps> = ({points, total, signer, systemCalls, components, position, onClick = () => console.log()}) => {

    let {buff, nerf, add_piece} = systemCalls;
    let [type, set_type] = useState(0);
    let stats_id = getEntityIdFromKeys([BigInt(type)]) as Entity
    let stats = getComponentValue(components.PieceType, stats_id)?.piece_stats;
    console.log(stats)
    return (
        <group scale = {1.75} position={position}>
            <Selector position={[0,-1.5,0]} label="type" cur={type} next={() => set_type(type+1)} prev={() => set_type(type-1)} total={total} />
            <Text scale={.5} position={[0,1.5,0]}>
                {"points: " + points}
                <meshBasicMaterial color = "black"/>
            </Text>
            <Text scale={.5} position={[0,2,0]}>
                {"current dmg: " + stats.dmg}
                <meshBasicMaterial color = "black"/>
            </Text>
            
            {points > 100 && <Button scale={.75}  position={[-1,3,0]} label="buff" onClick={() => buff(signer, type)} />}
            {points > 100 && <Button scale={.75} color = "blue" position={[1,3,0]} label="nerf" onClick={() => nerf(signer, type)} />}
            {points > 1000 && <Button scale={.75} position={[0,1,0]} label="add_piece" onClick={() => add_piece(signer)} />}

            <Cylinder onClick={onClick} >
                <meshBasicMaterial color={getColor(type)}/>
            </Cylinder>
        </group>
    )
}

export default Gov;