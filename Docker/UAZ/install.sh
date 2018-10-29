apt-get install software-properties-common -y
apt-get install dialog -y

# install Git
apt-get install git -y


# Java
add-apt-repository -y ppa:webupd8team/java
apt-get update
echo "oracle-java8-installer shared/accepted-oracle-license-v1-1 select true" | debconf-set-selections
apt-get install -y oracle-java8-installer

# Anaconda
apt-get install bzip2
wget https://repo.anaconda.com/archive/Anaconda3-5.3.0-Linux-x86_64.sh
bash Anaconda3-5.3.0-Linux-x86_64.sh -b

export PATH="/root/anaconda3/bin/:$PATH"

# install graphviz
apt-get install graphviz libgraphviz-dev -y

# install scala and SBT
apt-get remove scala-library scala
wget http://scala-lang.org/files/archive/scala-2.12.7.deb
dpkg -i scala-2.12.7.deb
apt-get update
apt-get install scala

# install SBT
apt-get install apt-transport-https -y
echo "deb https://dl.bintray.com/sbt/debian /" |  tee -a /etc/apt/sources.list.d/sbt.list
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2EE0EA64E40A89B84B2DF73499E82A75642AC823
apt-get update
apt-get install sbt -y


export JAVA_HOME="/usr/lib/jvm/java-8-oracle/"
export PATH="$JAVA_HOME/bin:$PATH"

# clone the Eidos repo
git clone https://github.com/clulab/eidos.git

apt-get install vim -y

# get vectors
cd eidos

#cp /data/vectors.txt src/main/resources/org/clulab/wm/eidos/english/w2v

wget https://s3.amazonaws.com/world-modelers/data/vectors.txt
mv vectors.txt src/main/resources/org/clulab/wm/eidos/english/w2v/

# update Eidos conf to use W2V
sed -i 's/useW2V = false/useW2V = true/' src/main/resources/eidos.conf

# Assemble Eidos
sbt assembly

# Create Conda Env for INDRA and run install
conda create -n indra_env python=3.7.0 pip -y
conda activate indra_env
pip install --upgrade pip
pip install objectpath
pip install Cython
pip install git+https://github.com/sorgerlab/indra.git
pip install pygraphviz pyjnius flask jupyter
pip install matplotlib
pip install fuzzywuzzy seaborn

# Set Eidos class path for INDRA
#echo "import indra" | python
#sed -i 's/EIDOSPATH = /EIDOSPATH = \/home\/ubuntu\/eidos\/target\/scala-2.12\/eidos-assembly-0.2.2-SNAPSHOT.jar/' /home/ubuntu/.config/indra/config.ini

export EIDOSPATH="/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar"

cd ../
# Install BioNetGen
wget https://s3.amazonaws.com/world-modelers/applications/BioNetGen-2.3.1-Linux.tar.gz
tar xvzf BioNetGen-2.3.1-Linux.tar.gz
mv BioNetGen-2.3.1 /usr/local/share/BioNetGen

# Install Delphi
git clone https://github.com/ml4ai/delphi
cd delphi
python setup.py install

# Get Delphi Data
apt-get install unzip -y
cd ../
wget https://s3.amazonaws.com/world-modelers/data/delphi_data.zip
unzip delphi_data.zip

# Set DELPHI_DATA environment variable
export DELPHI_DATA=/data/