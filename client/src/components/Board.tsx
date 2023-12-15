import { FC } from "react";
import Square from "./Square";

interface BoardProps {
    position: [number,number,number]
    squareValues:any[]
}

const Board: FC<BoardProps> = ({position, squareValues}) => {
    console.log(squareValues)
    const squares = squareValues.flat().map( (square) => {
        console.log(square)
        let tempPosition: [number, number, number] = [position[0] + square.x, position[1]+3, position[2]+square.y];
        console.log(tempPosition);
        return (<Square position={tempPosition} color= "blue" />);
    })

    return (
        <>
            {squares}
        </>
    )
}

export default Board;