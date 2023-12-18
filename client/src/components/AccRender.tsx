import {FC} from 'react';
import { blo } from 'blo';
import { useLoader } from '@react-three/fiber';
import {TextureLoader} from 'three';

interface AccRenderProps {
    address: string
    position: [number,number,number]
    onClick?: () => any
}

const AccRender: FC<AccRenderProps> = ({address, position, onClick=(() => console.log(address))}) => {
    let img = blo(`0x${address.slice(2)}`);
    let texture = useLoader(TextureLoader, img);
    

    return (
        <>
        <mesh rotation={[0,0,0]} position={position} onClick={onClick}>
            <planeGeometry args={[1,1]} />
            <meshBasicMaterial map={texture}/>
        </mesh>
        </>
    )
} 

export default AccRender;