const get_moves: (x: number) => [number, number][] = (id: number) => {
    let moves: [number, number][] = [];
    if(id == 0) {
        moves.push([1,0])
        moves.push([1,1])
        moves.push([1,-1])
        moves.push([0,1])
        moves.push([0,-1])
        moves.push([-1,0])
        moves.push([-1,1])
        moves.push([-1,-1])
    }
    if(id == 1) {
        moves.push([1,0])
        moves.push([1,1])
        moves.push([1,-1])
        moves.push([0,1])
        moves.push([0,-1])
        moves.push([-1,0])
        moves.push([-1,1])
        moves.push([-1,-1])
    }
    if(id == 2) {
        moves.push([1,0])
        moves.push([2,0])
        moves.push([0,1])
        moves.push([0,2])
        moves.push([0,-1])
        moves.push([0,-2])
        moves.push([-1,0])
        moves.push([-2,0])
    }
    if(id == 3) {
        moves.push([1,1])
        moves.push([2,2])
        moves.push([-1,1])
        moves.push([-2,2])
        moves.push([1,-1])
        moves.push([2,-2])
        moves.push([-1,1])
        moves.push([-2,2])
    }
    return moves;
}

export default get_moves;