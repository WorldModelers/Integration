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

# General Findings
For a standard Python package, INDRA is easy to install but complex to configure. A key integration is missing: integration with Eidos via a web service. It appears that this integration will not be challenging to resolve.

INDRA documentation is robust, however certain key components related to the Eidos integration are overlooked. Generally speaking, Eidos integration with INDRA appears to be secondary to biology specific integrations. Subsequently, there the INDRA/Eidos integration has limited documentation and exemplification.

## Documentation
INDRA has both a [Read the Docs instance](https://indra.readthedocs.io/en/latest/)(RTD) and a [Github Pages instance](http://www.indra.bio/). The Github Pages docs provide a high-level overview of the software, while the RTD provides detailed functional documentation.

The documentation for integrating INDRA and Eidos could be expanded; there is critical information that is lacking in the top-level documentation but can be found as comments in code (see: the [Eidos Source init file](https://github.com/sorgerlab/indra/blob/master/indra/sources/eidos/__init__.py).

# Installation:
The latest release (`v1.8.0`) was installed from [Github](https://github.com/sorgerlab/indra) by following the instructions detailed in the [Eidos Software Report](https://github.com/WorldModelers/Integration/blob/master/Reports/Eidos-Setup-Report.md#indra-invocation).

Additionally, `JAVA_HOME` should be set with:

```
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64 export PATH=$JAVA_HOME/bin:$PATH
```

Next ensure that [Graphviz](www.graphviz.org) is installed with:

```
sudo apt-get install graphviz libgraphviz-dev
pip install pygraphviz
```

You will also need to install [BioNetGen](https://www.csb.pitt.edu/Faculty/Faeder/?page_id=409) for [PySB](http://pysb.org/) to work correctly. To do this, run:

```
wget https://s3.amazonaws.com/world-modelers/applications/BioNetGen-2.3.1-Linux.tar.gz
tar xvzf BioNetGen-2.3.1-Linux.tar.gz
sudo mv BioNetGen-2.3.1 /usr/local/share/BioNetGen
```


# Running INDRA
INDRA and Eidos integration was successful using the [INDRA Test Notebook](https://github.com/WorldModelers/Integration/blob/master/Notebooks/INDRA_tests.ipynb) available in this repository. This relies on having a built Eidos JAR and ensuring that it is available for INDRA usage.

## Eidos Web Service
Per [INDRA documentation](https://indra.readthedocs.io/en/latest/modules/sources/eidos/index.html?highlight=webservice#indra.sources.eidos.api.process_text), Eidos can be invoked via a web service instead of through the assembled JAR. However, in practice this fails. Running:

```
ep = eidos.process_text(text, webservice='http://localhost:9000')
```

where the Eidos webapp is running at `localhost:9000` fails. This issue appears to have 3 causes:

1. INDRA sends a `POST` request to Eidos (see INDRA's [`process_text` call](https://github.com/sorgerlab/indra/blob/master/indra/sources/eidos/api.py#L22-L60)) when Eidos expects a `GET` (see Eidos [webapp routes](https://github.com/clulab/eidos/blob/master/webapp/conf/routes)).
2. INDRA routes the request to a `process_text` endpoint at the Eidos web service (which does not exist) instead of a `parseText` endpoint.
3. The Eidos `parseText` endpoint returns JSON, instead of the expected JSON-LD.

This issue is detailed (though not solved) in a related [pull request to Eidos](https://github.com/clulab/eidos/pull/484).
