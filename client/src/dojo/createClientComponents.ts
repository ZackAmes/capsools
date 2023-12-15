import { overridableComponent } from "@dojoengine/recs";
import { SetupNetworkResult } from "./setupNetwork";

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({
    contractComponents,
}: SetupNetworkResult) {
    return {
        ...contractComponents,
        Secret: overridableComponent(contractComponents.Secret),
        Game: overridableComponent(contractComponents.Game),
        Square: overridableComponent(contractComponents.Square),

    };
}
