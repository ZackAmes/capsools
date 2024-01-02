import {FC} from 'react';
import {Text} from '@react-three/drei';


interface ButtonProps {
    label: string
    color?: string
    position: [number,number,number]
    scale?: number
    background?:string
    onClick : () => any
} 

const Button: FC<ButtonProps> = ({scale=1,color="red",background="clear", position, label, onClick}) => {
    return (
    <>
        <mesh scale={scale} rotation={[0,0,0]} position={position} onClick={onClick}>
            <Text color={color}>
                {label}
            </Text>
            <meshBasicMaterial color = {background}/>
        </mesh>
    </>)
}

export default Button;