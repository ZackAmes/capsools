import { Account } from "starknet";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { ClientComponents } from "./createClientComponents";
import {
    getEntityIdFromKeys,
    getEvents,
    setComponentsFromEvents,
} from "@dojoengine/utils";
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { client }: { client: IWorld },
    contractComponents: ContractComponents,
    { Player, Manager }: ClientComponents
) {
    const new_player = async (account: Account) => {

        try {
            const { transaction_hash } = await client.hub.new_player({
                account
            });

            setComponentsFromEvents(
                //@ts-ignore
                contractComponents,
                getEvents(
                    await account.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
        } 
    };
    const mint_piece = async (account: Account) => {

        try {
            const { transaction_hash } = await client.genshin.mint_piece({
                account,
            });

            setComponentsFromEvents(
                //@ts-ignore
                contractComponents,
                getEvents(
                    await account.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
        } 
    };
    const create_team = async (account: Account) => {

        try {
            const { transaction_hash } = await client.builder.create_team({
                account,
            });

            setComponentsFromEvents(
                //@ts-ignore
                contractComponents,
                getEvents(
                    await account.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
        } 
    };
    const add_piece_to_team = async (account: Account, piece_id: number, team_id: number) => {

        try {
            const { transaction_hash } = await client.builder.add_piece_to_team({
                account, piece_id, team_id
            });

            setComponentsFromEvents(
                //@ts-ignore
                contractComponents,
                getEvents(
                    await account.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
        } 
    };
    const remove_piece_from_team = async (account: Account, piece_id: number, team_id: number) => {

        try {
            const { transaction_hash } = await client.builder.remove_piece_from_team({
                account, piece_id, team_id
            });

            setComponentsFromEvents(
                //@ts-ignore
                contractComponents,
                getEvents(
                    await account.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
        } 
    };
    const starter_team = async (account: Account) => {

        try {
            const { transaction_hash } = await client.builder.starter_team({
                account,
            });

            setComponentsFromEvents(
                //@ts-ignore
                contractComponents,
                getEvents(
                    await account.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
        } 
    };
    const create_challenge = async (account: Account, team_id: number) => {

        try {
            const { transaction_hash } = await client.arena.create_challenge({
                account, team_id
            });

            setComponentsFromEvents(
                //@ts-ignore
                contractComponents,
                getEvents(
                    await account.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
        } 
    };
    const accept_challenge = async (account: Account, game_id: number, team_id: number) => {

        try {
            const { transaction_hash } = await client.arena.accept_challenge({
                account, game_id, team_id
            });

            setComponentsFromEvents(
                //@ts-ignore
                contractComponents,
                getEvents(
                    await account.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
        } 
    };
    const take_turn = async (account: Account, piece_id: number, game_id: number, x: number, y:number) => {

        try {
            const { transaction_hash } = await client.arena.take_turn({
                account, piece_id, game_id, x, y
            });

            setComponentsFromEvents(
                //@ts-ignore
                contractComponents,
                getEvents(
                    await account.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
        } 
    };


    


    return {
        new_player,
        mint_piece,
        add_piece_to_team,
        remove_piece_from_team,
        create_team,
        starter_team,
        create_challenge,
        accept_challenge,
        take_turn
    };
}
