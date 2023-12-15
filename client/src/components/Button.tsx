import {FC} from 'react';
import {Text} from '@react-three/drei';


interface ButtonProps {
    label: string
    color?: string
    position: [number,number,number]
    scale?: number
    click : () => any
} 

const Button: FC<ButtonProps> = ({scale=1,color="red", position, label, click}) => {
    return (
    <>
        <mesh scale={scale} rotation={[0,0,0]} position={position} onClick={click}>
            <Text color={color}>
                {label}
            </Text>
            <meshBasicMaterial/>
        </mesh>
    </>)
}

export default Button;