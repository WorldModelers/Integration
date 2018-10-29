FROM ubuntu:16.04

RUN apt-get update

COPY install.sh /
RUN /install.sh


COPY test_eidos.sh /
COPY test_UAZ.sh /
COPY Notebooks/INDRA_tests.ipynb /
COPY Notebooks/Delphi_tests.ipynb /