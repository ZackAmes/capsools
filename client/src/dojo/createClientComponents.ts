import { overridableComponent } from "@dojoengine/recs";
import { SetupNetworkResult } from "./setupNetwork";

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({
    contractComponents,
}: SetupNetworkResult) {
    return {
        ...contractComponents,
        Team: overridableComponent(contractComponents.Team),
        Game: overridableComponent(contractComponents.Game),
        Piece: overridableComponent(contractComponents.Piece),
        Player: overridableComponent(contractComponents.Player),
        Manager: overridableComponent(contractComponents.Manager)

    };
}
