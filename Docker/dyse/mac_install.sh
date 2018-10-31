# Create and source env
conda create -n pitt_env python=3.7.0 pip -y
source activate pitt_env
pip install --upgrade pip
pip install jupyter
pip install plotly 
pip install xlrd -y

# MCL https://micans.org/mcl/
wget https://micans.org/mcl/src/mcl-latest.tar.gz
tar xzf mcl-latest.tar.gz
cd mcl-14-137/
./configure --prefix=$HOME/local
make install
cd ../

# gsl install https://www.gnu.org/software/gsl/
apt-get install libgsl-dev -y

git clone https://jgawrilo@bitbucket.org/biodesignlab/framework.git

export FRAMEWORKPATH=$HOME/j/WM/pitt/framework

cd ../

# Compile Model Checking executables
cd ${FRAMEWORKPATH}/Checking/dishwrap_v1.0/dishwrap
make

# HAD to do this for examples.ipynb to work!
cd ${FRAMEWORKPATH}/Checking/dishwrap_v1.0/monitor
make

# Install cudd for sensitivity analysis
cd ${FRAMEWORKPATH}/Sensitivity/cudd-3.0.0
./configure
make
make install

# Compile Sensitivity Analysis executables
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

### RUNNING

cd ${FRAMEWORKPATH}
jupyter notebook