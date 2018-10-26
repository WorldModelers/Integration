#!/bin/bash

# start.sh

CONTAINER_NAME="indra_box"

# build container
docker build -f Dockerfile . -t $CONTAINER_NAME


docker run -it -p 8888:8888 $CONTAINER_NAME /bin/bash
