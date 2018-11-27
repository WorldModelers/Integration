# SAUCE Analysis

* Analysis Date: 11/27/2018


* System: MacOS 10.13.6
* Scala Version: 2.12.7
* Java Version: Oracle java version 1.8.0_71

# Contents
* [Background](#background)
* [General Findings](#general-findings)
* [Documentation](#documentation)
* [Installation](#installation)

# Background

Getting hooked into CRA's code required setting up a SecSign account and getting access to their collab repos:

Jira:                      https://jira.collab.cra.com

Bitbucket:           https://git.collab.cra.com

Confluence:       https://wiki.collab.cra.com

Build Instructions: https://wiki.collab.cra.com/display/SAUCE/SAUCE+Build+Instructions


# General Findings

## Documentation

Most of this taken from: https://wiki.collab.cra.com/display/SAUCE/SAUCE+Build+Instructions

Not really any information for why you'd want to use this

# Installation:

Prerequisite Software
Java JDK 1.8.0u191 (or higher)
http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
Scala 2.12.2
https://www.scala-lang.org/download/2.12.2.html
Deployment Only: Figaro depends on Scala 2.12.2, but SBT will install it for SAUCE developers
Python 3.6.4 (or higher)
https://www.python.org/downloads/release/python-364/
Required Python Modules: numpy, sortedcontainers
SBT 0.13.16
https://www.scala-sbt.org/
Node.js 8.11.3 (or higher)
https://nodejs.org/en/
For Windows: add your Node directory to your PATH after installation
Yarn 1.7.0 (or higher)
https://yarnpkg.com/en/

```
mkdir SAUCE
git clone https://jgawrilo@git.collab.cra.com/scm/sauce/sauce.git
git clone https://jgawrilo@git.collab.cra.com/scm/sauce/server.git
git clone https://jgawrilo@git.collab.cra.com/scm/sauce/sauce-ui.git
git clone https://jgawrilo@git.collab.cra.com/scm/sauce/figaro.git

# Build everything
cd SAUCE/sauce
chmod +x build.sh
./build.sh
cd ../

# Project Execution
cd SAUCE/server
chmod +x sbt-server.sh
./sbt-server.sh
cd ../
# Point a browser at http://localhost:8080/sauce-service/version and you should see the following response

# UI
cd SAUCE/sauce-ui
#(to install the packages it depends on; only need to do this after cloning/pulling)
yarn
yarn start
cd ../

# Not sure why we need to do this...
# Project Deployment
cd SAUCE/server
chmod +x deploy-server.sh
./deploy-server.sh
cd releases/server
chmod +x start-server.sh
./start-server.sh

# Point a browser at http://localhost:8080/sauce-service/version and you should see the following response
```
