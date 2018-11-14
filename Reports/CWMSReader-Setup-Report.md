# CWMS Reader

* Analysis Date: 11/14/2018


* System Version: Ubuntu 16.04.3 LTS
* Java Version: OpenJDK version 1.8.0_181
* SBCL (Lisp) version: SBCL 1.3.1.debian

# Contents
* [Background](#background)
* [General Findings](#general-findings)
* [Documentation](#documentation)
* [Installation](#installation)
* [Running](#running)

# Background

CWMS Reader is IHMC's machine reading software component for World Modelers. It is currently [available on Github](https://github.com/wdebeaum/cwmsreader). It is a component of the [TRIPS system](http://trips.ihmc.us/parser/).

There is an example [web based UI for the CWMS Reader](http://trips.ihmc.us/parser/cgi/cwmsreader) hosted by IHMC.

There is an API availble which is also hosted by IHMC. Documentation for the [API is available here](http://trips.ihmc.us/parser/api.html).

# General Findings

The build seems to require Python2 and will break if the default system Python is Python3. See [Gensim installation within Makefile](https://github.com/wdebeaum/cwmsreader/blob/1cb9ba1acb5ba56df20b543dbc78b8f69376780d/src/VariableFinder/Makefile#L30)

# Documentation

There is a [README file](https://github.com/wdebeaum/cwmsreader/blob/master/README.md) associated with the CWMS Reader Github repo. It would be beneficial if it contained a table of contents. The README does contain installation and usage instructions. It does not explain the system's primary function or use cases where it would be appropriate.

There is a secondary [README for generating TRIPS components](https://github.com/wdebeaum/cwmsreader/blob/master/src/Hello/README.txt) but it is similarly unclear when/where doing this would be appropriate.

There is a third [README for parsing PDFs](https://github.com/wdebeaum/cwmsreader/blob/master/src/PDFExtractor/README.html). This README is in HTML, the primary README is in markdown and the second one is plain text. Ideally this would all be composed in the same language.

# Installation

Installation script:

```
sudo apt-get update

# Install Git and Java
sudo apt-get install git -y
sudo apt-get install unzip -y
sudo apt-get install default-jdk -y
sudo apt-get install openjfx -y

# Install SBCL flavor Lisp and Perl
sudo apt-get install sbcl -y
sudo apt-get install libdbi-perl -y

# Install NodeJS + NPM
sudo apt-get install nodejs -y
sudo apt-get install npm -y

# Install pip and virtualenv
sudo apt-get install python-pip -y
sudo apt-get install virtual -y

# Set default Python for virtualenv to ensure using Python2
export VIRTUALENV_PYTHON=/usr/bin/python

# Install GDAL
sudo add-apt-repository ppa:ubuntugis/ppa -y && sudo apt-get update
sudo apt-get install gdal-bin -y

# Install ImageMagick
sudo apt-get install imagemagick -y

# Clone repository and set $TRIPS_BASE variable
git clone https://github.com/wdebeaum/cwmsreader.git
TRIPS_BASE=$(pwd)/cwmsreader/

# Download WordNet data
sudo mkdir /usr/local/share/wordnet/
sudo chmod -R +777 /usr/local/share/wordnet/
cd /usr/local/share/wordnet/
wget https://s3.amazonaws.com/world-modelers/data/WordNet-3.0.tar.bz2
wget https://s3.amazonaws.com/world-modelers/data/WordNet-3.0-glosstag.tar.bz2
tar xvjf WordNet-3.0.tar.bz2
tar xvjf WordNet-3.0-glosstag.tar.bz2
rm WordNet-3.0.tar.bz2 WordNet-3.0-glosstag.tar.bz2


# Download Geonames data
sudo mkdir /usr/local/share/geonames/
sudo chmod -R +777 /usr/local/share/geonames/
cd /usr/local/share/geonames/
wget https://s3.amazonaws.com/world-modelers/data/NationalFile_20181001.zip
mkdir 2018-10-01
mv $(ls | grep National) 2018-10-01/NationalFile.zip

# Download Stanford CoreNLP
sudo mkdir /usr/local/share/stanford-corenlp/
sudo chmod -R +777 /usr/local/share/stanford-corenlp/
cd /usr/local/share/stanford-corenlp/
wget https://s3.amazonaws.com/world-modelers/applications/stanford-corenlp-full-2018-10-05.zip
unzip stanford-corenlp-full-2018-10-05.zip
rm stanford-corenlp-full-2018-10-05.zip

# Configure CWMS Reader
cd $TRIPS_BASE/src/
./configure --with-lisp=sbcl
make
make install

```

# Running

# API

The CWMS Reader API is part of the TRIPS API generally and can be accessed at the `http://trips.ihmc.us/parser/cgi/cwms` endpoint. You should submit a request using the syntax described in the API documentation ([see API docs](http://trips.ihmc.us/parser/api.html))

The API accepts text to be parsed and returns XML including the CWMS parsing. You can interact with it using the below Python3 example.

```
import requests
import urllib.parse
import xml.etree.ElementTree as ET

# set up URL and query
url = 'http://trips.ihmc.us/parser/cgi/cwms?input='
query = '''Drought in South Sudan is causing regional instability. Decreased water has negatively impacted crop yields. Lack of food is causing an uptick in violence in the area.'''

# url encode query 
query_formatted = urllib.parse.quote_plus(query)

# generate complete query string
query_str = url + query_formatted

# submit query to API
response = requests.get(url + query_formatted)

# Extract XML response
xmlstring = response.text

# Parse XML response if desired
tree = ET.ElementTree(ET.fromstring(xmlstring))

# Write XML to disk
tree.write('sample_cwms_query.xml')
```