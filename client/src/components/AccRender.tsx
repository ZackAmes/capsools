import {FC} from 'react';
import { blo } from 'blo';
import {Account} from 'starknet';
import { useLoader } from '@react-three/fiber';
import {TextureLoader} from 'three';

interface AccRenderProps {
    account: Account
    position: [number,number,number]
    click: () => any
}

const AccRender: FC<AccRenderProps> = ({account, position, click}) => {
    let address = account.address.slice(2);
    let img = blo(`0x${address}`);
    let texture = useLoader(TextureLoader, img);
    

    return (
        <>
        <mesh rotation={[0,0,0]} position={position} onClick={click}>
            <planeGeometry args={[1,1]} />
            <meshBasicMaterial map={texture}/>
        </mesh>
        </>
    )
} 

export default AccRender;