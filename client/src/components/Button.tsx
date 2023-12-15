import {FC} from 'react';
import {Text} from '@react-three/drei';


interface ButtonProps {
    label: string
    color?: string
    coords: number[]
    scale?: number
    click : () => any
} 

const Button: FC<ButtonProps> = ({scale=1,color="red", coords, label, click}) => {
    return (
    <>
        <mesh scale={scale} rotation={[0,0,0]} position={[coords[0], coords[1], coords[2]]} onClick={click}>
            <Text color={color}>
                {label}
            </Text>
            <meshBasicMaterial/>
        </mesh>
    </>)
}

export default Button;