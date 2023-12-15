import {FC} from 'react';
import AccRender from './AccRender';
import Button from './Button';

interface BurnersProps {
    create: () => any
    clear: () => any
    select: (arg:any) => any
    list: () => any[]
    isDeploying?: boolean
    coords: number[]
}

const Burners: FC<BurnersProps> = ({create, clear, select, list, isDeploying, coords}) => {

    const burners = list().map( (account, index) => {
        return (
            <AccRender key={account.address} account={account} coords={[coords[0], coords[1]-index, coords[2]]} click={() => select(account.address)}/>
        )
    })
    

    return (
        <>
            <Button scale = {.5} color={"blue"} coords={[coords[0]-1,coords[1] + 1,coords[2]]} 
                    label={"clear"} click={clear}/>
            <Button scale = {.5} color={"blue"} coords={[coords[0]+1, coords[1] + 1, coords[2]]} 
                    label={"create"} click={create}/>
            {burners}
        </>
    )
}
export default Burners;