function update_position(position:[number, number, number], update: [number, number, number]) {

    let res: [number, number, number] = [
        position[0] + update[0],
        position[1] + update[1],
        position[2] + update[2]
    ]
    
    return res
}

export default update_position;