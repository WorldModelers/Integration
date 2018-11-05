FROM ubuntu:16.04

RUN apt-get update && apt-get install -y \
    build-essential \
    software-properties-common

RUN add-apt-repository ppa:ubuntu-toolchain-r/test

RUN apt-get update && apt-get install -y \
    gcc-8 \
    g++-8 \
    git \
    wget \
    unzip \
    libgsl-dev \
    libboost-all-dev

# Set the working directory to /app
WORKDIR /

# Install Anaconda
RUN wget https://repo.anaconda.com/archive/Anaconda3-5.3.0-Linux-x86_64.sh
RUN bash Anaconda3-5.3.0-Linux-x86_64.sh -b
RUN rm Anaconda3-5.3.0-Linux-x86_64.sh

# Add Conda to PATH
ENV PATH /root/anaconda3/bin:$PATH

# Create Conda environment
RUN conda create -n pitt_env python=3.7.0 pip -y
RUN pip install --upgrade pip 
RUN pip install jupyter \
	plotly \
	xlrd \
	indra

# Install MCL
RUN wget https://micans.org/mcl/src/mcl-latest.tar.gz
RUN tar xzf mcl-latest.tar.gz
WORKDIR /mcl-14-137
RUN ./configure --prefix=$HOME/local
RUN make install
WORKDIR /

# Install DySE
RUN wget https://s3.amazonaws.com/world-modelers/repos/dyse.zip
RUN unzip dyse.zip
ENV FRAMEWORKPATH $HOME/framework

# Install automake
RUN apt-get install -y automake
RUN ln -s /usr/bin/aclocal-1.15 /usr/bin/aclocal-1.14

# Install Dishwrap
WORKDIR ${FRAMEWORKPATH}/Checking/dishwrap_v1.0/dishwrap
RUN make
WORKDIR ${FRAMEWORKPATH}/Checking/dishwrap_v1.0/monitor
RUN make

# Install Cudd for sensitivity analysis
WORKDIR ${FRAMEWORKPATH}/Sensitivity/cudd-3.0.0
RUN ./configure
RUN make
RUN make install

# Update PATH variable
ENV PATH "${FRAMEWORKPATH}/Checking/dishwrap_v1.0/dishwrap:$PATH"
ENV PATH "${FRAMEWORKPATH}/Checking/dishwrap_v1.0/monitor:$PATH"
ENV PATH "${FRAMEWORKPATH}/Sensitivity/Dynamic:$PATH"
ENV PATH "${FRAMEWORKPATH}/Sensitivity/Static:$PATH"

# Install DySE
RUN cd ${FRAMEWORKPATH}; python setup.py install

# Obtain WM Example Notebook and configure directories
WORKDIR /
RUN wget https://s3.amazonaws.com/world-modelers/repos/dyse-wm-example.zip
RUN unzip dyse-wm-example.zip
RUN mkdir Site_Visit_Demo/a Site_Visit_Demo/a/b/ Site_Visit_Demo/a/b/c
RUN mv Site_Visit_Demo/API Site_Visit_Demo/a/b/c/API
RUN mv Site_Visit_Demo/files Site_Visit_Demo/a/b/c/files
RUN wget https://s3.amazonaws.com/world-modelers/data/style.js
RUN mv style.js Site_Visit_Demo/a/b/c/API/style.js
RUN mkdir Code
RUN mv framework Code/Framework

# Install CytoscapeJS
RUN apt-get install -y npm
RUN npm install webpack -g
RUN wget https://deb.nodesource.com/setup_6.x && bash setup_6.x
RUN apt-get install -y nodejs
# RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN git clone https://github.com/cytoscape/jupyter-cytoscape.git
WORKDIR jupyter-cytoscape
RUN sed '/notebook/d' -i makefile
RUN make

# Make port 8888 available to the world outside this container
EXPOSE 8888

# Run Jupyter Notebook
WORKDIR /
CMD jupyter notebook --ip=0.0.0.0 --port=8888 --allow-root --NotebookApp.token='' --NotebookApp.password=''