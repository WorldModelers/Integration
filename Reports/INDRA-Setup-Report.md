# INDRA Analysis

* Analysis Date: 10/22/2018
* Software Release: INDRA v1.8.0
* URL: [https://github.com/sorgerlab/indra](https://github.com/sorgerlab/indra)

Brandon tested with:

* System: Ubuntu 16.04
* Scala Version: 2.12.7
* Java Version: openjdk 1.8.0_181
* Java Runtime Environment: OpenJDK Runtime Environment (build 1.8.0_181-8u181-b13-0ubuntu0.16.04.1-b13)

# Contents
* [General Findings](#general-findings)
* [Documentation](#documentation)
* [Installation](#installation)
* [Running INDRA](#running-indra)
* [INDRA REST API](#indra-rest-api)

# General Findings
For a standard Python package, INDRA is easy to install but complex to configure. A key integration is missing: integration with Eidos via a web service. It appears that this integration will not be challenging to resolve.

INDRA documentation is robust, however certain key components related to the Eidos integration are overlooked. Generally speaking, Eidos integration with INDRA appears to be secondary to biology specific integrations. Subsequently, there the INDRA/Eidos integration has limited documentation and exemplification.

## Documentation
INDRA has both a [Read the Docs instance](https://indra.readthedocs.io/en/latest/)(RTD) and a [Github Pages instance](http://www.indra.bio/). The Github Pages docs provide a high-level overview of the software, while the RTD provides detailed functional documentation.

The documentation for integrating INDRA and Eidos could be expanded; there is critical information that is lacking in the top-level documentation but can be found as comments in code (see: the [Eidos Source init file](https://github.com/sorgerlab/indra/blob/master/indra/sources/eidos/__init__.py).

# Installation:
The following steps were used for system configuration and installation on Ubuntu 16.04.

```
sudo apt-get update

# install Git
sudo apt-get install git

# install JRE
sudo apt-get install openjdk-8-jre openjdk-8-jdk

# install Anaconda
wget https://repo.anaconda.com/archive/Anaconda3-5.3.0-Linux-x86_64.sh
bash Anaconda3-5.3.0-Linux-x86_64.sh

# install graphviz
sudo apt-get install graphviz libgraphviz-dev

# install scala and SBT
sudo apt-get remove scala-library scala
sudo wget http://scala-lang.org/files/archive/scala-2.12.7.deb
sudo dpkg -i scala-2.12.7.deb
sudo apt-get update
sudo apt-get install scala

# install SBT
echo "deb https://dl.bintray.com/sbt/debian /" | sudo tee -a /etc/apt/sources.list.d/sbt.list
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2EE0EA64E40A89B84B2DF73499E82A75642AC823
sudo apt-get update
sudo apt-get install sbt

# set JAVA_HOME in .bashrc
echo "export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64 export PATH=$JAVA_HOME/bin:$PATH" >> /home/ubuntu/.bashrc
source ~/.bashrc

# clone the Eidos repo
git clone https://github.com/clulab/eidos.git

# get vectors
cd ~/eidos
wget https://s3.amazonaws.com/world-modelers/data/vectors.txt
mv vectors.txt src/main/resources/org/clulab/wm/eidos/english/w2v

# update Eidos conf to use W2V
sed -i 's/useW2V = false/useW2V = true/' src/main/resources/eidos.conf

# Assemble Eidos
sbt assembly

# Test installation with:
JAVA_OPTS="-Xmx8g" scala -cp target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar org.clulab.wm.eidos.apps.examples.ExtractFromText

# Create Conda Env for INDRA and run install
conda create -n indra_env python=3.7 pip
source activate indra_env
pip install --upgrade pip
pip install Cython
pip install git+https://github.com/sorgerlab/indra.git
pip install pygraphviz pyjnius flask jupyter

# Set Eidos class path for INDRA
echo "import indra" | python
sed -i 's/EIDOSPATH = /EIDOSPATH = \/home\/ubuntu\/eidos\/target\/scala-2.12\/eidos-assembly-0.2.2-SNAPSHOT.jar/' /home/ubuntu/.config/indra/config.ini

# Install BioNetGen
wget https://s3.amazonaws.com/world-modelers/applications/BioNetGen-2.3.1-Linux.tar.gz
tar xvzf BioNetGen-2.3.1-Linux.tar.gz
sudo mv BioNetGen-2.3.1 /usr/local/share/BioNetGen
```

# Running INDRA
INDRA and Eidos integration was successful using the [INDRA Test Notebook](https://github.com/WorldModelers/Integration/blob/master/Notebooks/INDRA_tests.ipynb) available in this repository. This relies on having a built Eidos JAR and ensuring that it is available for INDRA usage.

## Using INDRA Doc Processing script
[INDRA_Doc_Processing.py](https://github.com/WorldModelers/Integration/blob/master/Scripts/INDRA_Processing/INDRA_Doc_Processing.py) available in this repository.
### Script Config
```
EIDOS_WS_URL = [URL TO EIDOS WEB SERVICE (Default: http://localhost:5000)]
SOURCE_DIRECTORY = [SOURCE DIRECTORY WHERE DOCUMENTS ARE READ FROM (must include trailing forward-slash)]
DESTINATION_DIRECTORY = [DESTINATION DIRECTORY WHERE PROCESSED DOCUMENTS ARE STORED (exclude trailing forward-slash)]
```

`INDRA_Doc_Processing.py` will iterate over each file in the source directory and use Eidos to process and store the processed file in the configured destination directory.

## Eidos Web Service
INDRA does have the ability to run a [lightweight Flask web service](https://github.com/sorgerlab/indra/blob/master/indra/sources/eidos/server.py) for issues commands to Eidos. There is a discussion about whether this should be included in Eidos, not INDRA, here in a related [pull request to Eidos](https://github.com/clulab/eidos/pull/484).

Based on the documentation, it can be run with:

```
python -m indra.sources.eidos.server
```

and then it can be used with:

```
from indra.sources import eidos



text = """A significant increase in precipitation resulted in food
insecurity and a decrease in humanitarian interventions.
Actually, food insecurity itself can lead to conflict, and in turn,
conflict can drive food insecurity. Generally, humanitarian
interventions reduce conflict."""

ep = eidos.process_text(text, webservice='http://localhost:5000')
```

# INDRA REST API
The INDRA REST API is available at [http://api.indra.bio:8000](http://api.indra.bio:8000). It has API documentation available here [http://www.indra.bio/rest_api/docs/](http://www.indra.bio/rest_api/docs/). The documentation is auto-generated from Swagger.

The API has 3 primary endpoints for managing World Modelers related reading and converting reading output into INDRA statements:

* `/eidos/process_jsonld`
* `/hume/process_jsonld`
* `/cwms/process_text`

The Eidos endpoint was tested by providing it a sample of Eidos reading provided by UAZ. The output was as expected, a set of INDRA statements in JSON format.

The Hume endpoint was tested by providing it a sample of Hume reading provided by Raytheon BBN. No statements were produced. HMS is currently investigating this issue.

The CWMS endpoint was tested by providing it a sample of relevant text. INDRA communicated with the CWMS API automatically to perform reading. INDRA then parsed the reading output and returned the expected INDRA statements.

### Additional endpoints
Additional endpoints were tested but neither functioned as expected. These were:

* `/preassembly/map_grounding`: returned no statements when passed a set of INDRA statements
* `/preassembly/filter_belief`: returned no statements irrespective of the belief threshold provided