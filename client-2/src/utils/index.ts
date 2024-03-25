import { getEntityIdFromKeys } from "@dojoengine/utils"
import { getComponentValue } from "@dojoengine/recs"


export function get_ids(Manager:any, address:any, count:number, label: string) {

    let manager_type;
    if(label == "player") {
        manager_type = 0
    }
    else if(label == "piece") {
        manager_type = 1
    }
    else if(label == "game") {
        manager_type = 2
    }
    else if(label == "team") {
        manager_type = 3
    }
    else if(label == "challenge") {
        manager_type = 5
    }

    const ids = [];

    if(manager_type){
        for(let i=0; i<count; i++){

            let manager_id = getEntityIdFromKeys([BigInt(address),BigInt(manager_type),BigInt(i)])

            if(manager_type == 5) {
                manager_id = getEntityIdFromKeys([BigInt(0), BigInt(5), BigInt(i)])
            }
            let manager = getComponentValue(Manager, manager_id);


            if(manager) {
                let id = getEntityIdFromKeys([BigInt(manager.id)]);
                ids.push(id);
                
            }    
        }
    }

    return ids;
}

export function update_position(position:[number, number, number], update: [number, number, number]) {

    let res: [number, number, number] = [
        position[0] + update[0],
        position[1] + update[1],
        position[2] + update[2]
    ]
    
    return res
}

export const get_moves: (x: number) => [number, number][] = (id: number) => {
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

        moves.push([-1,-1])
        moves.push([-2,-2])
    }
    return moves;
}

