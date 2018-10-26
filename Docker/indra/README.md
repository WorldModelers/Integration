# INDRA and EIDOS Docker Container Creation
This contains code and instructions for standing up a container with INDRA and EIDOS installed such that the test scripts and notebooks can run.  It only assumes Docker is installed.


1. `./start.sh` - Builds the container (will take a while) and runs bash in the container such that you can test below.
2. `./test_eidos.sh` - Test the EIDOS [Scala API](https://github.com/WorldModelers/Integration/blob/master/Reports/Eidos-Setup-Report.md#scala-api) and that EIDOS was intalled correctly.
3. `./test_indra.sh` - Test the INDRA/EIDOS integration through running the [jupyter notebook](https://github.com/WorldModelers/Integration/blob/master/Notebooks/INDRA_tests.ipynb)
4.  Head to [http://localhost:8888/notebooks/INDRA_tests.ipynb](http://localhost:8888/notebooks/INDRA_tests.ipynb) and run!