#!/usr/bin/env sh

set -ex

PROJECT_NAME="template"
IMAGE_HASH="$(date '+%s')"
IMAGE_TAG="$PROJECT_NAME:$IMAGE_HASH"

docker build \
--pull \
--force-rm \
-t "$IMAGE_TAG" \
.
