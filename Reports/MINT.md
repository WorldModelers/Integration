# MINT Repository Guide

This document is meant to describe the various Github repositories used for [ISI's MINT](http://mint-project.info/).

## UI Components

* [MINT-UI](https://github.com/KnowledgeCaptureAndDiscovery/MINT-UI): this is the core repository for the MINT UI. An (outdated) version of it is running at [mint-ui.org](http://mint-ui.org/). It is a Polymer web application.
 
* [MINT-ModelCatalogExplorer](https://github.com/KnowledgeCaptureAndDiscovery/MINT-ModelCatalogExplorer): a lightweight UI for examining the models available in the MINT Model Catalog. A version of it is running at [ontosoft.isi.edu:8081](http://ontosoft.isi.edu:8081/). This will ultimately be incorporated into the main MINT UI. It is a Polymer web application.

* [MINT-WfResultRegistrationUI](https://github.com/KnowledgeCaptureAndDiscovery/MINT-WfResultRegistrationUI): this application enables a user to take an executed workflow from the MINT Provenance Catalog and register it in the MINT Data Catalog. It is a Polymer web application.

* [MINT](https://github.com/KnowledgeCaptureAndDiscovery/MINT): this repository houses the primary project website [mint-project.info](http://mint-project.info/). It is not related to the overall MINT software architecture.


## REST API Components

* [MINT-ProvenanceQueries](https://github.com/KnowledgeCaptureAndDiscovery/MINT-ProvenanceQueries): this repository hosts a set of SPARQL queries (as `.rq` files). These are standard queries to interact with the MINT Provenance Catalog. A [grlc](https://github.com/CLARIAH/grlc) application relies on the queries in this repository and the SPARQL endpoint for the MINT Provenance Catalog to automatically generate a REST API. The API is available [here](http://ontosoft.isi.edu:8001/api/KnowledgeCaptureAndDiscovery/MINT-ProvenanceQueries).

* [MINT-ModelCatalogQueries](https://github.com/KnowledgeCaptureAndDiscovery/MINT-ModelCatalogQueries): this repository hosts a set of SPARQL queries (as `.rq` files). These are standard queries to interact with the MINT Model Catalog. A [grlc](https://github.com/CLARIAH/grlc) application relies on the queries in this repository and the SPARQL endpoint for the MINT Model Catalog to automatically generate a REST API. The API is available [here](http://ontosoft.isi.edu:8001/api/KnowledgeCaptureAndDiscovery/MINT-ModelCatalogQueries).


## Workflow Components

* [Wings](https://github.com/KnowledgeCaptureAndDiscovery/wings): Wings is a semantic workflow system that is used by MINT. It's full documentation is available at [wings-workflows.org](http://www.wings-workflows.org/).

* [Pegasus](https://github.com/pegasus-isi/pegasus): Pegasus is the execution engine used by MINT in production. Wings can run in standalone mode, or it can use Pegasus for distributed computation (e.g. on the Open Science Grid). It's full documentation is available at [pegasus.isi.edu](https://pegasus.isi.edu/).

* [WINGS-OPMW-Mapper](https://github.com/KnowledgeCaptureAndDiscovery/WINGS-OPMW-Mapper): this repository contains code that takes a given workflow excution from Wings and translates that workflow into an RDF persistent representation of the execution. It is not explicitly MINT related, but is used in MINT in conjunction with Wings.


## Catalog Components

* [Mint-ModelCatalog-Ontology](https://github.com/KnowledgeCaptureAndDiscovery/Mint-ModelCatalog-Ontology): this repository specifies the data model that is used for the MINT Model Catalog. It contains descriptions of flattened databases for the MINT Model Catalog. The MINT Model Catalog is generated from these files (`.csv`s).

* [MINT-Ontology](https://github.com/KnowledgeCaptureAndDiscovery/MINT-Ontology): this repository defines the schema that is used throughout MINT. The ontology can be explored at [w3id.org/mint/mo/0.0.1](https://w3id.org/mint/mo/0.0.1).


## Deployment Components

* [DockerHub MINT Project](https://hub.docker.com/u/mintproject): hosted, pre-built Docker containers for the various models used in MINT workflows.

* [Wings-Docker](https://github.com/KnowledgeCaptureAndDiscovery/wings-docker): contains Docker code for containerizing the Wings application.

* [MINT-WorkflowDomain](https://github.com/KnowledgeCaptureAndDiscovery/MINT-WorkflowDomain): contains Docker code for all the models currently used in MINT.