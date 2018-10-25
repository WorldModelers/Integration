# Delphi Analysis

* Analysis Date: 10/25/2018
* Software Release: Delphi v3.0.0
* URL: [https://github.com/ml4ai/delphi](https://github.com/ml4ai/delphi)

Brandon tested with:

* System: Ubuntu 16.04
* Scala Version: 2.12.7
* Java Version: openjdk 1.8.0_181
* Java Runtime Environment: OpenJDK Runtime Environment (build 1.8.0_181-8u181-b13-0ubuntu0.16.04.1-b13)
* Python 3.7.0

# Contents
* [General Findings](#general-findings)
* [Documentation](#documentation)
* [Installation](#installation)
* [Running INDRA](#running-indra)

# General Findings
Similar to INDRA, Delphi is easy to install but is still somewhat complex to configure and get running. It has requirements that are not explicitly installed along with it (in its `setup.py` file), namely INDRA as well as other Python packages. 

Furthermore, it requires a data download and environment variable configuration, which is not typical of most Python libraries. 

Delphi documentation is focused on function; the most useful components of the documentation are found in example Jupyter Notebooks. Delphi example code could perform reading with Eidos, assembly with INDRA, and modeling with Delphi but do not do this. Demonstrating this entire pipeline is an area for improvement.

Data standards for parameterization data and concepts are not explicitly described, which could lead to "brittleness" of the software when attempting to use it for different regions or use cases.

## Documentation
Delphi has both a [Read the Docs instance (RTD)](https://delphi.readthedocs.io/en/latest/index.html) as well as basic install and usage information on a [Github README](https://github.com/ml4ai/delphi/blob/master/README.md). 

The documentation does not describe in detail how data sources for parameterization must be formatted nor does it describe how data used to map concepts to indicators must be formatted. In the example notebook, concepts are pulled from a sample of [UN FAO data](http://vision.cs.arizona.edu/adarsh/export/demos/data/concept_to_indicator_mapping.txt). Parameterization [data for South Sudan](http://vision.cs.arizona.edu/adarsh/export/demos/data/south_sudan_data.csv) is used but its provenance is not explicitly cited nor its format described.

# Installation:
First, the steps for installing Eidos and INDRA were run ([see steps here](https://github.com/WorldModelers/Integration/blob/master/Reports/INDRA-Setup-Report.md#installation)). Then the following were run:

```
git clone https://github.com/ml4ai/delphi
cd delphi
python setup.py install

# Get Delphi Data
sudo apt-get install unzip
wget https://s3.amazonaws.com/world-modelers/data/delphi_data.zip
unzip delphi_data.zip

# Set DELPHI_DATA environment variable
echo "export DELPHI_DATA=/home/ubuntu/data/ export PATH=$DELPHI_DATA/bin:$PATH" >> /home/ubuntu/.bashrc
source ~/.bashrc

pip install fuzzywuzzy seaborn
```

Note that `pipenv` was not used (per the Delphi README) since `conda` was already used to establish an environment for INDRA (and Delphi). If 

# Running Delphi
The [Delphi Demo Notebook](https://github.com/ml4ai/delphi/blob/master/notebooks/Delphi-Demo-Notebook.ipynb) was run through successfully without any major issues. 
