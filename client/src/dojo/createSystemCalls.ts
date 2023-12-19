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
    { Secret }: ClientComponents
) {
    const spawn = async (signer: Account) => {
        const entityId = getEntityIdFromKeys([
            BigInt(signer.address),
        ]) as Entity;

        

        try {
            const { transaction_hash } = await execute(
                signer,
                "actions",
                "spawn",
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
    };

    const set_secret = async (signer: Account, value: number) => {
        const entityId = getEntityIdFromKeys([
            BigInt(signer.address),
        ]) as Entity;

        

        try {
            const { transaction_hash } = await execute(
                signer,
                "actions",
                "set_secret",
                [value]
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

    const take_turn = async (signer: Account, game_id: number, x: number, y:number) => {
        
        try {
            const { transaction_hash } = await execute(
                signer,
                "actions",
                "take_turn",
                [game_id, x, y]
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

    const challenge = async (signer: Account, opp: Account) => {
        
        try {
            const { transaction_hash } = await execute(
                signer,
                "actions",
                "challenge",
                [opp.address]
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
        spawn,
        set_secret,
        take_turn,
        challenge
    };
}
