import { Connector, useConnect, useAccount } from "@starknet-react/core";
import React, {FC} from "react";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent, useCloseDialog } from "../ui/dialog";
import { Text, Image, Svg, SvgIconFromText } from "@react-three/uikit";

interface ModalProps {
  open: boolean,
  setOpen: (open: boolean) => void
}

const ConnectModal:FC<ModalProps> = ({open, setOpen}:ModalProps) => {
  
  const { connect, connectors } = useConnect();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button backgroundColor="grey" variant="outline">
          <Text>Connect Wallet</Text>
        </Button>
      </DialogTrigger>
      <DialogContent positionType="relative" paddingY={60} transformTranslateZ={200} sm={{ maxWidth: 425 }}>
        {connectors.map((connector: Connector) => {
          console.log(connector.icon.dark)
          return (
            <Button
              key={connector.id}
              onClick={async () => {
                connector.available() ? connect({ connector }) : null
                setOpen(false)
                }
              }
            >
              { /* connector.icon.dark && (
                <SvgIconFromText text={connector.icon.dark} svgHeight={100} svgWidth={100} />
              ) */}
              <Image src={connector.icon.dark} marginRight={8} width={16} height={16} />

              <Text >Connect {connector.name}</Text>
            </Button>
          );
        })}
      </DialogContent>
    </Dialog>
  )
}

export default ConnectModal
