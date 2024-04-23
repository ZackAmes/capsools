import React, {FC} from "react"
import { Text, Container } from "@react-three/uikit"
import ConnectModal from "./starknet/ConnectModal"
import { useAccount, useBalance, useDisconnect, useNetwork } from "@starknet-react/core"
import { Button } from "./ui/button"

interface PageProps {
    open: boolean,
    setOpen: (open: boolean) => void
}

const Page:FC<PageProps> = ({open, setOpen}:PageProps) => {
    const {address} = useAccount();
    const network = useNetwork();
    const balance = useBalance({address}).data;
    const {disconnect} = useDisconnect();

    return (

        <Container flexDirection="column">
        <Container borderBottom={1}>
        <Container backgroundColor="blue" height={64} alignItems="center" flexDirection="row" paddingX={16}>
            <Container marginLeft="auto" flexDirection="row" alignItems="center" gap={16}>
                {address ? 
                    <Button variant="destructive" onClick={() => disconnect()}>
                        <Text> {address.slice(0,6,)}...{address.slice(-4)}</Text>
                    </Button> : 
                    <ConnectModal open={open} setOpen={setOpen}/> 
                }
            </Container>
        </Container>
        </Container>

        <Text>
            {network.chain.network}
        </Text>
        <Text>
            {balance? balance.value.toString() : "no balance"}
        </Text>
        </Container>
    )
}

export default Page;