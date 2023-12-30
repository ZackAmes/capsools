import { getEntityIdFromKeys } from "@dojoengine/utils"
import { getComponentValue } from "@dojoengine/recs"


function get_ids(Manager:any, address:any, count:number, label: string) {

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

    const ids = [];

    if(manager_type){
        for(let i=0; i<count; i++){
            let manager_id = getEntityIdFromKeys([BigInt(address),BigInt(manager_type),BigInt(i)])
            let manager = getComponentValue(Manager, manager_id);

            if(manager) {
                let id = getEntityIdFromKeys([BigInt(manager.id)]);
                console.log(manager);
                ids.push(id);
                
            }    
        }
    }

    return ids;
}

export default get_ids;