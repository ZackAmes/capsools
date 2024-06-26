#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

export RPC_URL="http://localhost:5050";

export WORLD_ADDRESS=$(cat ./manifests/dev/manifest.json | jq -r '.world.address')

export HUB_ADDRESS=$(cat ./manifests/dev/manifest.json | jq -r '.contracts[] | select(.name == "project::systems::hub::hub" ).address')
export GENSHIN_ADDRESS=$(cat ./manifests/dev/manifest.json | jq -r '.contracts[] | select(.name == "project::systems::genshin::genshin" ).address')
export BUILDER_ADDRESS=$(cat ./manifests/dev/manifest.json | jq -r '.contracts[] | select(.name == "project::systems::builder::builder" ).address')
export ARENA_ADDRESS=$(cat ./manifests/dev/manifest.json | jq -r '.contracts[] | select(.name == "project::systems::arena::arena" ).address')
export GOV_ADDRESS=$(cat ./manifests/dev/manifest.json | jq -r '.contracts[] | select(.name == "project::systems::gov::gov" ).address')

echo "---------------------------------------------------------------------------"
echo world : $WORLD_ADDRESS 
echo " "
echo hub : $HUB_ADDRESS
echo genshin : $GENSHIN_ADDRESS
echo builder : $BUILDER_ADDRESS
echo arena : $ARENA_ADDRESS
echo gov: $GOV_ADDRESS
echo "---------------------------------------------------------------------------"

# enable system -> component authorizations
COMPONENTS=("Player" "Manager" "PlayerCount")

for component in ${COMPONENTS[@]}; do
    sozo auth grant --world $WORLD_ADDRESS --rpc-url $RPC_URL writer $component,$HUB_ADDRESS 
done

echo "Hub authorizations have been successfully set."
echo "---------------------------------------------------------------------------"


GENSHIN_COMPONENTS=("Player" "Manager" "Piece")

for component in ${GENSHIN_COMPONENTS[@]}; do
    sozo auth grant --world $WORLD_ADDRESS --rpc-url $RPC_URL writer $component,$GENSHIN_ADDRESS 
done

echo "Genshin authorizations have been successfully set."
echo "---------------------------------------------------------------------------"

BUILDER_COMPONENTS=("Player" "Manager" "Team" "Piece" "Game")

for component in ${BUILDER_COMPONENTS[@]}; do
    sozo auth grant --world $WORLD_ADDRESS --rpc-url $RPC_URL writer $component,$BUILDER_ADDRESS
done

echo "Builder authorizations have been successfully set."
echo "---------------------------------------------------------------------------"


ARENA_COMPONENTS=("Player" "Piece" "Manager" "SetManager" "Team" "Game")

for component in ${ARENA_COMPONENTS[@]}; do
    sozo auth grant  --world $WORLD_ADDRESS --rpc-url $RPC_URL writer $component,$ARENA_ADDRESS
done

echo "Arena authorizations have been successfully set."
echo "---------------------------------------------------------------------------"


GOV_COMPONENTS=("Player" "SetManager" "PieceType")

for component in ${GOV_COMPONENTS[@]}; do
    sozo auth grant  --world $WORLD_ADDRESS --rpc-url $RPC_URL writer $component,$GOV_ADDRESS
done

echo "Gov authorizations have been successfully set."
