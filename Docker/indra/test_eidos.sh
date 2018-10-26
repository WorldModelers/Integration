export PATH="/root/anaconda3/bin/:$PATH"
export JAVA_HOME="/usr/lib/jvm/java-8-oracle/"
export PATH="$JAVA_HOME/bin:$PATH"
export EIDOSPATH="/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar"

cd eidos

# Test installation with:
JAVA_OPTS="-Xmx8g" scala -cp target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar org.clulab.wm.eidos.apps.examples.ExtractFromText