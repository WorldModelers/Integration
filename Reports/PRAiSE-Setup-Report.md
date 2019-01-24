# PRAiSE Server Installation
PRAiSE can be installed with Docker to run locally per the instructions detailed in [SRI-Report.md](https://github.com/WorldModelers/Integration/blob/master/Reports/SRI-Report.md#praise-wm). 


## Debugging the websocket connection
The installation detailed in [SRI-Report.md](https://github.com/WorldModelers/Integration/blob/master/Reports/SRI-Report.md#praise-wm) relies on a prebuilt Docker from the SRI container registry. It expects that the frontend web application, which runs on `localhost:4567` can make a websocket connection to `localhost:4568`. 

This presents an issue: a real user of the web application _will not have anything running at `localhost:4568`_. So, the client should make calls to `someserver:4568`, not `localhost`. The functionality that defines how the client determines the appropriate websocket endpoint resides `praise-wm/src/main/webapp/src/services/http.js`. Specifically, the [`getUrlForWebsocketEndpoint`](https://gitlab.sri.com/world-modelers/praise-wm/blob/master/src/main/webapp/src/services/http.js#L77-85) function seems to specify the websocket port should be either the webapplication port or that port + 1 on line 82:

```
const wsPort = restPort + (restPort === actualRemoteServerPort ? 1 : 0);
```

In the case that the host is `praise.worldmodelers.com` the client resolves this to:

* `restPort = 0`
* `actualRemoteServerPort = 0`

and therefore `wsPort = 0` as well. So, the websocket connection attempt is made to:

```
wss://praise.worldmodelers.com:0/ws/notification?SEC_SESSION_ID=some_session_id
```

Which fails with the error:

```
notifications.js:171 WebSocket connection failed: Error in connection establishment: net::ERR_ADDRESS_INVALID
```

As a workaround, this was resolved by simply hardcoding a port for the variable `wsPort` (4569). This can be found in the file [PRAiSE_http.js](https://github.com/WorldModelers/Integration/blob/master/Configurations/PRAiSE_http.js).


## Building PRAiSE
Since a change is required to `praise-wm/src/main/webapp/src/services/http.js` for it to function correctly on a remote server deplyment, PRAiSE must be rebuilt. To do this, first [install Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/). Then install Java 8:

```
sudo apt-get install openjdk-8-jdk
```

Next, you'll need to run MySQL, which can easily be done with Docker:

```
docker-compose -f src/main/docker/mysql.yml up -d
```

Then, edit `praise-wm/src/main/webapp/src/services/http.js` appropriately and from the `praise-wm` directory run:

```
./gradlew yarnSetup yarn
```

and then

```
./gradlew yarnSetup yarn deploy
```

This last command builds a new JAR in `praise-wm/build/libs/`. The current version will be called `praisewm-2.3-all.jar` and it can be run at `localhost:4567` with:

```
java -jar build/libs/praisewm-2.3-all.jar
```

## Building a PRAiSE Container
To build the PRAiSE container, first move the JAR you just built to `src/main/docker` with

```
cp build/libs/praisewm-2.3-all.jar src/main/docker/praisewm.jar
```

You also need to move the keystore file to the Docker directory as well:

```
cp gencerts/keystore.jks src/main/docker/keystore.jsk
```

Next, navigate to the Docker directory with `cd src/main/docker`. We are now ready to build the container with:

```
docker build -t praisewmlocal .
```

This will build the container and tag it `praisewmlocal` (vs. the remote pre-built container on SRI's container registry). Now, put the file [`praisewm-local.yml`](https://github.com/WorldModelers/Integration/blob/master/Configurations/praisewm-local.yml) in this directory. It is basically the same Docker Compose file as [`praisewm.yml`](https://gitlab.sri.com/world-modelers/praise-wm/blob/master/src/main/docker/praisewm.yml) except the container image is the local one we just built, not the remote pre-built container.

Run the container with:

```
docker-compose -f praisewm-local.yml up -d
```

## Configuring NGINX
[CertBot](https://certbot.eff.org/) was used to create a certificate for (praise.worldmodelers.com). Then, a basicauth password was created following the [instructions here](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/).

Next, this [PRAiSE NGINX configuration](https://github.com/WorldModelers/Integration/blob/master/Configurations/PRAiSE) was used to properly route traffic and to pass arguments and headers to the Docker container that runs at `localhost:4567`.