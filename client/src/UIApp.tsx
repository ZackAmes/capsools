import { Canvas } from "@react-three/fiber";
import React, {useState} from "react";
import { useBlockNumber, useNetwork } from "@starknet-react/core";
import { Fullscreen} from "@react-three/uikit";
import { Defaults } from "./components/ui/theme";
import { DialogAnchor } from "./components/ui/dialog";
import Page from "./components/Page";
import UITest from "./scenes/UITest.tsx"
import { Root, Container, Text } from "@react-three/uikit";

const UIApp = () => {

    return (
        <Canvas
        flat
        camera={{ position: [0, 0, 18], fov: 35 }}
        style={{ height: '100dvh', touchAction: 'none' }}
        gl={{ localClippingEnabled: true }}
        >
            <Fullscreen backgroundColor={0xffffff} dark={{ backgroundColor: 0x0 }}>
                <Defaults>
                    <UITest />
                </Defaults>
            </Fullscreen>
        </Canvas>
    )
}

export default UIApp;
