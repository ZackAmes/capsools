import { overridableComponent } from "@dojoengine/recs";
import { ContractComponents } from "./generated/contractComponents";

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({
    contractComponents,
}: {
    contractComponents: ContractComponents;
}) {
    return {
        ...contractComponents,
        Team: overridableComponent(contractComponents.Team),
        Game: overridableComponent(contractComponents.Game),
        Piece: overridableComponent(contractComponents.Piece),
        Player: overridableComponent(contractComponents.Player),
        Manager: overridableComponent(contractComponents.Manager),
        SetManager: overridableComponent(contractComponents.SetManager)
    };
}
