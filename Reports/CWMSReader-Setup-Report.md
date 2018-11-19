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

The interface is complicated and require passing Knowledge Query and Manipulation Language (KQML) queries to the reader from a client. It is possible to write scripts which do this, but there is no apparent API for scripting languages so one would still need to generate KQML and pass that to the reader.

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
TRIPS_BASE=$(pwd)/cwmsreader

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

First, make sure $TRIPS_BASE is set:

```
echo $TRIPS_BASE
```

If this is empty, you can set this with 
```
cd ~/
TRIPS_BASE=$(pwd)/cwmsreader`
```

Now, let's create a test file. Navigate to `$TRIPS_BASE` with `cd $TRIPS_BASE` then run:

```
echo "Drought in South Sudan is causing regional instability. Decreased water has negatively impacted crop yields. Lack of food is causing an uptick in violence in the area." >> sample.txt
```

With `$TRIPS_BASE` set you can use the following to run the reader without a UI:

`
$TRIPS_BASE/bin/trips-cwms -reader -nouser
`

Once this is running, open up another terminal window, set $TRIPS_BASE, and then run the TRIPS client with:

`
$TRIPS_BASE/bin/trips_client
`

This client will connect to the CWMS Reader instance you already have running (which is actually running at `localhost:6200`). From this client, you can send messages. Try registering your client with:

```
(register :name test-client)
(tell :content (module-status ready)) 
```

Then, you can try submitting a file to be parsed. Note that you will have to replace `/home/ubuntu/cwmsreader/` with whatever value you have for `TRIPS_BASE`:

```
(request :receiver READER :content (run-file :folder "/home/ubuntu/cwmsreader/" :file "sample.txt" :reply-when-done t :exit-when-done f) :reply-with R01)
```

This should return the path to the parsed XML file:

```
(reply :content (result :uttnums (4 5 6) :ekb-file "/home/ubuntu/cwmsreader/bin/20181114T2148/sample_20181114T220006.ekb") :receiver TEST-CLIENT :in-reply-to R01 :sender READER)
```

In this case, `/home/ubuntu/cwmsreader/bin/20181114T2148/sample_20181114T220006.ekb` is an XML file containing the output from parsing `sample.txt` which was created previously. The output should look like:

```
<?xml version="1.0" encoding="UTF-8"?><ekb complete="true" domain="CWMS" id="sample" timestamp="20181114T220006">
    <input type="">
        <paragraphs>
            <paragraph file="/home/ubuntu/cwmsreader//sample.txt" id="paragraph1">Drought in South Sudan is causing regional instability. Decreased water has negatively impacted crop yields. Lack of food is causing an uptick in violence in the area.
</paragraph>
        </paragraphs>
        <sentences>
            <sentence id="4" pid="paragraph1">Drought in South Sudan is causing regional instability.</sentence>
            <sentence id="5" pid="paragraph1">Decreased water has negatively impacted crop yields.</sentence>
            <sentence id="6" pid="paragraph1">Lack of food is causing an uptick in violence in the area.</sentence>

...etc
```



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