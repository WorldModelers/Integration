#!/bin/bash

# start.sh

# SET username and password
# Note that password must be url encoded. To do this in Python 3 try:
# import urllib.parse
# urllib.parse.quote_plus(YOUR_PASSWORD_STRING)

USERNAME=""
PASSWORD=""

CONTAINER_NAME="dyse_box"

# build container
docker build -f Dockerfile . -t $CONTAINER_NAME --build-arg username=$USERNAME --build-arg password=$PASSWORD

# run Docker container
docker run -p 8888:8888 $CONTAINER_NAME
