#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

export RPC_URL="http://localhost:5050";

export WORLD_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.world.address')

export HUB_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "project::systems::hub::hub" ).address')
export GENSHIN_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "project::systems::genshin::genshin" ).address')
export CHALLENGE_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "project::systems::challenge::challenge" ).address')

echo "---------------------------------------------------------------------------"
echo world : $WORLD_ADDRESS 
echo " "
echo hub : $HUB_ADDRESS
echo genshin : $GENSHIN_ADDRESS
echo challenge : $CHALLENGE_ADDRESS
echo "---------------------------------------------------------------------------"

# enable system -> component authorizations
COMPONENTS=("Player" "Manager" "PlayerCount")

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

CHALLENGE_COMPONENTS=("Player" "Manager" "Team" "Piece" "Game")

for component in ${CHALLENGE_COMPONENTS[@]}; do
    sozo auth writer $component $CHALLENGE_ADDRESS --world $WORLD_ADDRESS --rpc-url $RPC_URL
done

echo "Challenge authorizations have been successfully set."