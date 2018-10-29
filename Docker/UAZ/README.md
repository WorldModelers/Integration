# INDRA and EIDOS Docker Container Creation
This contains code and instructions for standing up a container with INDRA and EIDOS installed such that the test scripts and notebooks can run.  It only assumes Docker is installed.


1. `./start.sh` - Builds the container (will take a while) and runs bash in the container such that you can test below.
2. `./test_eidos.sh` - Test the EIDOS [Scala API](https://github.com/WorldModelers/Integration/blob/master/Reports/Eidos-Setup-Report.md#scala-api) and that EIDOS was intalled correctly. **To be run in the container**
3. `./test_UAZ.sh` - Test the Eidos/INDRA/Delphi integration through running the [INDRA tests Jupyter notebook](https://github.com/WorldModelers/Integration/blob/master/Notebooks/INDRA_tests.ipynb) and the [Delphi tests Jupyter notebook](https://github.com/WorldModelers/Integration/blob/master/Notebooks/Delphi_tests.ipynb) **To be run in the container** **Assumes port 8888 is usable**
4.  Head to [http://localhost:8888/notebooks/INDRA_tests.ipynb](http://localhost:8888/notebooks/INDRA_tests.ipynb) in your browser to run the INDRA test notebook and [http://localhost:8888/notebooks/Delphi_tests.ipynb](http://localhost:8888/notebooks/Delphi_tests.ipynb) to run the Delphi test notebook!