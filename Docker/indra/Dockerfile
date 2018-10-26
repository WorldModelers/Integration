FROM ubuntu:16.04

RUN apt-get update

COPY install.sh /
RUN /install.sh


COPY test_eidos.sh /
COPY test_indra.sh /
COPY INDRA_tests.ipynb /