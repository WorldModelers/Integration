#!/bin/bash

# start.sh

CONTAINER_NAME="dyse_box"

# build container
docker build -f Dockerfile . -t $CONTAINER_NAME


docker run -it $CONTAINER_NAME /bin/bash
