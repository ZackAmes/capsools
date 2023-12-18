import {FC} from 'react';
import AccRender from './AccRender';
import Button from './Button';
import { Account } from 'starknet';

interface ChallengeProps {
    list: any
    signer: Account
    challenge: (signer:Account, opp: Account) => any
    position: [number,number,number]
}

const Challenge: FC<ChallengeProps> = ({list, signer, challenge, position}) => {


    const accounts = list().map( ( account: Account, index:number) => {
        if(account.address != signer.address){
            return (
                <AccRender key={account.address} address={account.address} 
                        position={[position[0], position[1]-index, position[2]]} 
                        onClick={() => challenge(signer, account)}/>
            )
        }
    })
    

    return (
        <>
            <Button scale = {.75} color={"blue"} position={[position[0],position[1] + 1.5,position[2]]} 
                    label={"CHALLENGE"} onClick={() => console.log("ok")}/>
            {accounts}
        </>
    )
}
export default Challenge;