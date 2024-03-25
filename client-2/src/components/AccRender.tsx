import { FC } from 'react';
import { blo } from 'blo';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Text } from '@react-three/drei';

interface AccRenderProps {
    address: string
    position: [number,number,number]
    label?: string
    onClick?: () => any
}

const AccRender: FC<AccRenderProps> = ({address, position, label="",onClick=(() => console.log(address))}) => {
    let img = blo(`0x${address}`);
    let texture = useLoader(TextureLoader, img);
    

    return (
        <>
        <mesh rotation={[0,0,0]} position={position} onClick={onClick}>
            <Text position={[-2,0,0]}>
                <meshBasicMaterial color = "black" />
                {label}
            </Text>
            <planeGeometry args={[1,1]} />
            <meshBasicMaterial map={texture}/>
        </mesh>
        </>
    )
} 

export default AccRender;