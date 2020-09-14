# CWMS Reader

* Analysis Date: 9/14/2020
* System Version: Ubuntu 18.04.05 LTS
* Java Version: OpenJDK version 1.8.0_265
* SBCL (Lisp) version: SBCL 1.4.5.debian

# Contents
* [Background](#background)
* [Special Issues](#special-issues)
* [Installation](#installation)
* [Running](#running)

# Background

CWMS PDFExtractor is IHMC's tool for table reading [available on Github](https://github.com/wdebeaum/cwmsreader). It is a component of the [TRIPS system](http://trips.ihmc.us/parser/).

# Special Issues

The build requires specific versions of Java and OpenJFX which were tricky to install (see installation script).

Additionaly, this tool reqiures a UI so VNC was required. VNC with Gnome (Ubuntu Desktop) was setup by following [these instructions](https://www.teknotut.com/en/install-vnc-server-with-gnome-display-on-ubuntu-18-04/).

# Installation

Installation script:

```
sudo apt update

# Install Java 8
sudo apt install openjdk-8-jdk openjdk-8-jre

# verify java install with:
java -version

# add java env variables
cat | sudo tee -a /etc/environment <<EOL
JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
JRE_HOME=/usr/lib/jvm/java-8-openjdk-amd64/jre
EOL

# install openjfx
sudo apt purge openjfx
sudo apt install openjfx=8u161-b12-1ubuntu2 libopenjfx-jni=8u161-b12-1ubuntu2 libopenjfx-java=8u161-b12-1ubuntu2
sudo apt-mark hold openjfx libopenjfx-jni libopenjfx-java

sudo apt-get install git -y
sudo apt-get install unzip -y

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
for d in KQML/ TripsModule/ util/cwc/ PDFExtractor/ ; do
  ( cd $d && make && make install ) ;
done
```

# Running

From `cwmsreader/src` run:

```
cd ../bin
./PDFExtractor -standalone
```

> Note: this was executed from a terminal through a desktop session with Gnome/VNC.