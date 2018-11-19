apt-get install build-essential -y
apt-get install software-properties-common -y
add-apt-repository ppa:ubuntu-toolchain-r/test
apt-get update
apt-get install gcc-8 g++-8 -y
apt-get install libxml2-dev



apt-get install dialog -y

# install Git
apt-get install git -y

apt-get install wget

# Anaconda
wget https://repo.anaconda.com/archive/Anaconda3-5.3.0-Linux-x86_64.sh
bash Anaconda3-5.3.0-Linux-x86_64.sh -b

export PATH="/root/anaconda3/bin/:$PATH"

conda create -n pitt_env python=3.7.0 pip -y
source activate pitt_env
pip install --upgrade pip
pip install jupyter
pip install plotly 
pip install xlrd

# MCL https://micans.org/mcl/
wget https://micans.org/mcl/src/mcl-latest.tar.gz
tar xzf mcl-latest.tar.gz
cd mcl-14-137/
./configure --prefix=$HOME/local
make install
cd ../

# gsl install https://www.gnu.org/software/gsl/
apt-get install libgsl-dev

# get it
cd $HOME
git clone https://jgawrilo@bitbucket.org/biodesignlab/framework.git

export FRAMEWORKPATH=$HOME/framework


# Compile Model Checking executables
apt-get install libboost-all-dev -y
cd ${FRAMEWORKPATH}/Checking/dishwrap_v1.0/dishwrap
make

# HAD to do this for examples.ipynb to work!
cd ${FRAMEWORKPATH}/Checking/dishwrap_v1.0/monitor
make

apt-get install automake
ln -s /usr/bin/aclocal-1.15 /usr/bin/aclocal-1.14
# Install cudd for sensitivity analysis
cd ${FRAMEWORKPATH}/Sensitivity/cudd-3.0.0
./configure
make
make install

# Compile Sensitivity Analysis executables
apt-get install vim
cd ${FRAMEWORKPATH}/Sensitivity/Dynamic/
make
cd ${FRAMEWORKPATH}/Sensitivity/Static/
make

export PATH="${FRAMEWORKPATH}/Checking/dishwrap_v1.0/dishwrap:$PATH"
export PATH="${FRAMEWORKPATH}/Checking/dishwrap_v1.0/monitor:$PATH"
export PATH="${FRAMEWORKPATH}/Sensitivity/Dynamic:$PATH"
export PATH="${FRAMEWORKPATH}/Sensitivity/Static:$PATH"

# Install Package? Don't think this worked.
cd ${FRAMEWORKPATH}
python setup.py install

pip install --upgrade pip
pip install jupyter
pip install plotly 


# Install Cytoscape
# Note that this does install Cytoscape but it isn't running as it can't be run headlessly
cd ../
wget https://github.com/cytoscape/cytoscape/releases/download/3.7.0/Cytoscape_3_7_0_unix.sh
bash Cytoscape_3_7_0_unix.sh -q

### RUNNING