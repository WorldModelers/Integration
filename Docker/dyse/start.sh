#!/bin/bash

# start.sh

CONTAINER_NAME="dyse_box"

# build container
docker build -f Dockerfile . -t $CONTAINER_NAME

# run Docker container
docker run -p 8888:8888 $CONTAINER_NAME
