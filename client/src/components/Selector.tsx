import {FC} from 'react';
import {Text} from '@react-three/drei';


interface SelectorProps {
    label: number
    total: number
    color?: string
    position: [number,number,number]
    scale?: number
    next : () => any
    prev: () => any
} 

const Selector: FC<SelectorProps> = ({scale=1, total, color="red", position, label, next, prev}) => {
    return (
    <>
        <group position = {position}>
            {label < total -1 && <mesh scale={scale} rotation={[0,0,0]} position={[3,0,0]} onClick={next}>
                <Text color={color}>
                    {">"}
                </Text>
                <meshBasicMaterial/>
            </mesh>}
            <mesh scale={scale} rotation={[0,0,0]} position={[0,0,0]} onClick={() => console.log(label)}>
                <Text color={color}>
                    {label}
                </Text>
                <meshBasicMaterial/>
            </mesh>
            {label > 0 && <mesh scale={scale} rotation={[0,0,0]} position={[-3,0,0]} onClick={prev}>
                <Text color={color}>
                    {"<"}
                </Text>
                <meshBasicMaterial/>
            </mesh>}
        </group>
    </>)
}

export default Selector;