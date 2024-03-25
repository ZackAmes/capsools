import {FC} from 'react';
import AccRender from './AccRender';
import Button from './Button';

interface BurnersProps {
    account : {
        create: any,
        clear: any,
        list: () => any[],
        select: any,
    }
    position: [number,number,number]
}

const Burners: FC<BurnersProps> = ({account: {create, clear, select, list}, position}) => {

    const burners = list().map( (account, index) => {
        return (
            <AccRender key={account.address} address={account.address} 
                       position={[position[0], position[1]-index, position[2]]} 
                       onClick={() => select(account.address)}/>
        )
    })
    

    return (
        <>
            <Button scale = {.5} color={"blue"} position={[position[0]-1,position[1] + 1,position[2]]} 
                    label={"clear"} onClick={clear}/>
            <Button scale = {.5} color={"blue"} position={[position[0]+1, position[1] + 1, position[2]]} 
                    label={"create"} onClick={create}/>
            {burners}
        </>
    )
}
export default Burners;