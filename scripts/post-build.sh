#!/bin/sh

# extract version from package.json
VERSION=$(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json)

# write version details to the file
printf "Product: CLEEN\n\nVersion: $VERSION" > dist/version.txt

# fetch the git commit
LAST_COMMIT_SHA=$(git rev-parse HEAD)
BRANCH=$(git branch --show-current)

# write git details to the file
JSON='{"version":"%s","branch":"%s","commit":"%s"}\n'
printf "$JSON" "$VERSION" "$BRANCH" "$LAST_COMMIT_SHA" > dist/version.json
