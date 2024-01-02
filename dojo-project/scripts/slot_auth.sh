#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

export RPC_URL="https://api.cartridge.gg/x/capsools/katana";

export WORLD_ADDRESS=$(cat ./target/release/manifest.json | jq -r '.world.address')

export HUB_ADDRESS=$(cat ./target/release/manifest.json | jq -r '.contracts[] | select(.name == "project::systems::hub::hub" ).address')
export GENSHIN_ADDRESS=$(cat ./target/release/manifest.json | jq -r '.contracts[] | select(.name == "project::systems::genshin::genshin" ).address')
export BUILDER_ADDRESS=$(cat ./target/release/manifest.json | jq -r '.contracts[] | select(.name == "project::systems::builder::builder" ).address')
export ARENA_ADDRESS=$(cat ./target/release/manifest.json | jq -r '.contracts[] | select(.name == "project::systems::arena::arena" ).address')

echo "---------------------------------------------------------------------------"
echo world : $WORLD_ADDRESS 
echo " "
echo hub : $HUB_ADDRESS
echo genshin : $GENSHIN_ADDRESS
echo challenge : $BUILDER_ADDRESS
echo arena : $ARENA_ADDRESS
echo "---------------------------------------------------------------------------"

# enable system -> component authorizations
COMPONENTS=("Player" "Manager" "SetManager" "PlayerCount")

for component in ${COMPONENTS[@]}; do
    sozo auth writer $component $HUB_ADDRESS --world $WORLD_ADDRESS --rpc-url $RPC_URL
done

echo "Hub authorizations have been successfully set."
echo "---------------------------------------------------------------------------"


GENSHIN_COMPONENTS=("Player" "Manager" "Piece")

for component in ${GENSHIN_COMPONENTS[@]}; do
    sozo auth writer $component $GENSHIN_ADDRESS --world $WORLD_ADDRESS --rpc-url $RPC_URL
done

echo "Genshin authorizations have been successfully set."
echo "---------------------------------------------------------------------------"

BUILDER_COMPONENTS=("Player" "Manager" "Team" "Piece" "Game")

for component in ${BUILDER_COMPONENTS[@]}; do
    sozo auth writer $component $BUILDER_ADDRESS --world $WORLD_ADDRESS --rpc-url $RPC_URL
done

echo "Builder authorizations have been successfully set."
echo "---------------------------------------------------------------------------"

ARENA_COMPONENTS=("Player" "Manager""SetManager"  "Team" "Piece" "Game")

for component in ${ARENA_COMPONENTS[@]}; do
    sozo auth writer $component $ARENA_ADDRESS --world $WORLD_ADDRESS --rpc-url $RPC_URL
done

echo "Builder authorizations have been successfully set."