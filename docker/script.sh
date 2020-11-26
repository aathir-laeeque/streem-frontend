#!/bin/sh

# extract version from package.json
VERSION=$(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json)

# run docker to build image with VERSION and latest tag
docker build --no-cache --build-arg NODE_VERSION=$(cat .nvmrc | tr -cd [:digit:].) --build-arg VERSION=$VERSION -f docker/Dockerfile --tag leucine.azurecr.io/cleen-dwi/frontend:latest --tag leucine.azurecr.io/cleen-dwi/frontend:$VERSION .

# push the images to leucine.azurecr.io
docker push leucine.azurecr.io/cleen-dwi/frontend:latest
docker push leucine.azurecr.io/cleen-dwi/frontend:$VERSION
