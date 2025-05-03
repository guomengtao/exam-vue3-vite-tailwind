#!/bin/bash

CONTAINER_NAME="vue3-test_vue-app_1"
DEFAULT_CMD="npm run build"

if [ $# -eq 0 ]; then
  CMD=$DEFAULT_CMD
else
  CMD="$@"
fi

echo "▶ Running in container [$CONTAINER_NAME]: $CMD"
docker exec -it "$CONTAINER_NAME" sh -c "$CMD" 