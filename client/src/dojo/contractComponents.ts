/* Autogenerated file. Do not edit manually. */

import { defineComponent, Type as RecsType, World } from "@dojoengine/recs";

export function defineContractComponents(world: World) {
  return {
	  Game: (() => {
	    return defineComponent(
	      world,
	      { id: RecsType.Number, data: { team_one: RecsType.Number, team_two: RecsType.Number, turn_count: RecsType.Number, is_active: RecsType.Boolean } },
	      {
	        metadata: {
	          name: "Game",
	          types: ["u32","u32","u32","u32","bool"],
	          customTypes: ["GameData"],
	        },
	      }
	    );
	  })(),
	  Manager: (() => {
	    return defineComponent(
	      world,
	      { owner: RecsType.BigInt, label: RecsType.Number, index: RecsType.Number, id: RecsType.BigInt },
	      {
	        metadata: {
	          name: "Manager",
	          types: ["felt252","u8","u32","felt252"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
	  PlayerCount: (() => {
	    return defineComponent(
	      world,
	      { world: RecsType.BigInt, count: RecsType.Number },
	      {
	        metadata: {
	          name: "PlayerCount",
	          types: ["felt252","u32"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
	  Piece: (() => {
	    return defineComponent(
	      world,
	      { id: RecsType.Number, data: { owner: RecsType.BigInt, location: RecsType.BigInt, position: { x: RecsType.Number, y: RecsType.Number }, piece_type: RecsType.Number } },
	      {
	        metadata: {
	          name: "Piece",
	          types: ["u32","felt252","felt252","u8","u8","enum"],
	          customTypes: ["PieceData","Vec2","PieceType"],
	        },
	      }
	    );
	  })(),
	  Player: (() => {
	    return defineComponent(
	      world,
	      { address: RecsType.BigInt, name: RecsType.BigInt, counts: { game_count: RecsType.Number, piece_count: RecsType.Number, team_count: RecsType.Number }, points: RecsType.Number },
	      {
	        metadata: {
	          name: "Player",
	          types: ["felt252","felt252","u32","u32","u32","u32"],
	          customTypes: ["Counts"],
	        },
	      }
	    );
	  })(),
	  Team: (() => {
	    return defineComponent(
	      world,
	      { id: RecsType.Number, owner: RecsType.BigInt, piece_count: RecsType.Number, piece_one: RecsType.Number, piece_two: RecsType.Number },
	      {
	        metadata: {
	          name: "Team",
	          types: ["u32","felt252","u8","u32","u32"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
  };
}
