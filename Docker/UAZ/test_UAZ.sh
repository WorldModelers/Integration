export PATH="/root/anaconda3/bin/:$PATH"
export JAVA_HOME="/usr/lib/jvm/java-8-oracle/"
export PATH="$JAVA_HOME/bin:$PATH"
export EIDOSPATH="/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar"
export DELPHI_DATA=/data/

conda activate indra_env

jupyter notebook --ip=0.0.0.0 --port=8888 --allow-root --NotebookApp.token='' --NotebookApp.password=''