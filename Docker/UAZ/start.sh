#!/bin/bash

# start.sh

# copy test Notebooks from top-level Notebook directory to Docker Context
cp -r ../../Notebooks/ .

# set container name variable
CONTAINER_NAME="indra_box"

# build container
docker build -f Dockerfile . -t $CONTAINER_NAME

# run Docker container
docker run -it -p 8888:8888 $CONTAINER_NAME /bin/bash
