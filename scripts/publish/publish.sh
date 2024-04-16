#!/bin/sh

BASE_HOME=$(cd "$(dirname "$0")/../.." && pwd)
PUBLISH_DIST="publish"

if [ ! -d "$BASE_HOME/$PUBLISH_DIST" ]; then
    echo "publish dir not found. Please build first."
    exit 1
fi

DIR_TARGET="$BASE_HOME/$PUBLISH_DIST"
cd "$DIR_TARGET" || exit 1
npm publish
echo "publish finish!!!"
rm -fr "$DIR_TARGET"
