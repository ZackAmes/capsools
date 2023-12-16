import { FC } from "react";
import { useComponentValue } from "@dojoengine/react";
import { Account } from "starknet";
import { getEntityIdFromKeys } from "@dojoengine/utils";

interface SecretProps {
    position: [number,number,number]
    components: any
    signer: Account
    onClick: () => {}
}

const Secret: FC<SecretProps> = ({position, components, signer, onClick}) => {

    const entityId = getEntityIdFromKeys([BigInt(signer.address)]);
    const secret = useComponentValue(components.Secret, entityId);

    const getColor = (value: number) => {
        return "rgb(0," + ((value+53)*28) % 255 + ",0)" 
    }

    return (
        <mesh scale = {3} position={position} onClick={onClick}>
            <sphereGeometry/>
            <meshBasicMaterial color = {secret ? getColor(secret.value) : "black"}/>
        </mesh>
    )
}

export default Secret;