import { SetupNetworkResult } from "./setupNetwork";
import { Account } from "starknet";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import {
    getEntityIdFromKeys,
    getEvents,
    setComponentsFromEvents,
} from "@dojoengine/utils";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute, contractComponents }: SetupNetworkResult,
    components :ClientComponents
) {
    const new_player = async (signer: Account) => {
        const entityId = getEntityIdFromKeys([
            BigInt(signer.address),
        ]) as Entity;

        

        try {
            const { transaction_hash } = await execute(
                signer,
                "hub",
                "new_player",
                [signer.address]
            );

            setComponentsFromEvents(
                contractComponents,
                getEvents(
                    await signer.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
        } 
    };



    const add_piece_to_team = async (signer: Account, piece_id: number, team_id: number, x: number, y: number) => {
        const entityId = getEntityIdFromKeys([
            BigInt(signer.address),
        ]) as Entity;

        let args: [number, number, number, number] = [piece_id, team_id, x, y];

        try {
            const { transaction_hash } = await execute(
                signer,
                "builder",
                "add_piece_to_team",
                args
            );

            setComponentsFromEvents(
                contractComponents,
                getEvents(
                    await signer.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
        } 
    };

    const create_team = async (signer: Account) => {

        try {
            const {transaction_hash} = await execute(
                signer,
                "builder",
                "create_team",
                []
            )
        
            setComponentsFromEvents(
                contractComponents,
                getEvents(
                    await signer.waitForTransaction(transaction_hash, {
                        retryInterval: 100
                    })
                )
            )
        } catch (e) {
            console.log(e);
        } 
    }


   

    const mint_piece = async (signer: Account) => {
        
        try {
            const { transaction_hash } = await execute(
                signer,
                "genshin",
                "mint_piece",
                []
            );

            setComponentsFromEvents(
                contractComponents,
                getEvents(
                    await signer.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
        } 
    }

    return {
        new_player,
        mint_piece,
        add_piece_to_team,
        create_team
    };
}
