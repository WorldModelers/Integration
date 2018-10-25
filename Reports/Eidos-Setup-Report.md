# Eidos Analysis

* Analysis Date: 10/10/2018 - 10/12/2018
* Software Branch: Master
* Software Version: 0.2.2-SNAPSHOT
* URL: [https://github.com/clulab/eidos](https://github.com/clulab/eidos)

Brandon tested with:

* System: MacOS 10.13.6
* Scala Version: 2.12.7
* Java Version: openjdk11

Justin tested with:

* System: MacOS 10.13.6
* Scala Version: 2.12.7
* Java Version: Oracle java version 1.8.0_71

# Contents
* [General Findings](#general-findings)
* [Documentation](#documentation)
* [Installation](#installation)
* [Running Eidos](#running-eidos)
* [Eidos Speed Test](#eidos-speed-test)
* [Scala API](#scala-api)
* [CLI Invocation](#cli-invocation)
* [Webapp](#webapp)
* [INDRA Invocation](#indra-invocation)

# General Findings
Eidos sits at the top of the World Modelers stack in many ways: it automatically reads documents and generates directed causal events in JSON or JSON-LD. 

Initial efforts to run Eidos, relying on provided documentation, failed. After compiling the source, the Scala API, CLI invocation, webapp, and INDRA invocation all failed with errors as detailed below. 

Additional debugging and configuration **not detailed in the documentation** enabled the integration team to run Eidos via INDRA. The standard Eidos example string (`"Water trucking has decreased due to the cost of fuel."`) was run, but returned an empty result set, indicating that the installation was not running as expected.

Furthermore, the documentation does not sufficiently describe how to invoke the Scala API and specifically what set up is required to do this. 

## Documentation
* Documentation should indicate how to actually run the example scripts provided for the Scala API
* Documentation should do a better job highlighting that there *is* a Python API available via INDRA
* "Eidos reading output can be visualized using INDRA and Jupyter notebooks. See below for an example.” is misleading; Eidos can be invoked via an API through INDRA.
* The documentation section for using Eidos with INDRA should explicitly state that this is Python and the snippet provide is Python code.

# Installation:
Installation instructions assume a knowledge of SBT, the scala interactive build tool. To get started, the user must have Java and Scala installed. On a Mac this can be accomplished with [homebrew](https://brew.sh/).

* install Java with homebrew: `brew cask install java`
* installed SBT with homebrew: `brew install sbt@1`

Next, the user should clone the Github repository with `git clone git@github.com:clulab/eidos`. The user should navigate to the repository (e.g. `cd ~/repos/eidos`).

From here, you can compile the source with:

```
sbt compile
```

You can also create a JAR:

```
sbt assembly
```

This took 6.5 minutes to run. It creates a JAR within the project directory which will be located at `/target/scala-2.12/eidos_2.12-0.2.2-SNAPSHOT.jar` (the specific JAR name may change based on version number, etc.). This JAR can be imported on a Java or Scala classpath.


# Running Eidos

## Eidos Speed Test
Eidos was run against [54 plain text articles](https://s3.amazonaws.com/world-modelers/data/news_articles.zip) pulled from the New York Times website on 10/25/2018. This was test was performed on an [Amazon EC2 t3.large](https://aws.amazon.com/ec2/instance-types/t3/) instance.

| Process             | Time  |
|---------------------|-------|
| Initialization      | 220 s |
| Resource Loading    | 155 s |
| Document Processing | 102 s |

After initialization and loading, document processing took about 2 seconds per document, indicating that Eidos could be run in real-time as a webservice on a per document basis.

## Scala API
After running `sbt assembly`, the following runs this simple [example](https://github.com/jgawrilo/eidos/blob/master/src/main/scala/org/clulab/wm/eidos/apps/examples/ExtractFromText.scala) showing the potential of integrating the functionality in your own app. **Please note you may need to use 8gb of RAM for this to work**
```
JAVA_OPTS="-Xmx8g" scala -cp target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar org.clulab.wm.eidos.apps.examples.ExtractFromText
```

* Copy/pasted this example [https://github.com/clulab/eidos/blob/master/README.md#to-produce-a-pretty-display-of-the-extracted-mentions](https://github.com/clulab/eidos/blob/master/README.md#to-produce-a-pretty-display-of-the-extracted-mentions) into a local file called `eidos_test.scala`
* Ran example with `scala -cp ~/repos/eidos/target/scala-2.12/eidos_2.12-0.2.2-SNAPSHOT.jar eidos_test.scala`
* Program failed with error.

Error:

```
Symbol 'type com.typesafe.config.Config' is missing from the classpath.
This symbol is required by 'value org.clulab.wm.eidos.EidosSystem.config'.
Make sure that type Config is in your classpath and check for conflicting dependencies with `-Ylog-classpath`.
A full rebuild may help if 'EidosSystem.class' was compiled against an incompatible version of com.typesafe.config.
  val reader = new EidosSystem()
```

## CLI Invocation
If you have a directory of text files and want Eidos to process them, you can do:

`sbt "runMain org.clulab.wm.eidos.apps.ExtractFromDirectory /Full/path/to/input/directory /Full/path/to/output/directory"`

You can also open an interactive shell where you can enter lines of text and see the results using:

`./shell`



* Created directory: `test_docs_txt` which contained one file called `test.txt`. This file has one line reading "Water trucking has decreased due to the cost of fuel."
* Created output directory `output_docs_txt` for the output
* Ran example with `sbt "runMain org.clulab.wm.eidos.apps.ExtractFromDirectory test_docs_txt output_docs_txt"` (provided absolute paths to input/output directories
* Program failed with error:

Error:

```
Caught NER exception!
Document:
org.clulab.processors.corenlp.CoreNLPDocument@67809417
[error] (run-main-0) edu.stanford.nlp.util.ReflectionLoading$ReflectionLoadingException: Error creating edu.stanford.nlp.time.TimeExpressionExtractorImpl
[error] edu.stanford.nlp.util.ReflectionLoading$ReflectionLoadingException: Error creating edu.stanford.nlp.time.TimeExpressionExtractorImpl
[error]     at edu.stanford.nlp.util.ReflectionLoading.loadByReflection(ReflectionLoading.java:40)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.create(TimeExpressionExtractorFactory.java:57)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.createExtractor(TimeExpressionExtractorFactory.java:38)
[error]     at edu.stanford.nlp.ie.regexp.NumberSequenceClassifier.<init>(NumberSequenceClassifier.java:86)
[error]     at edu.stanford.nlp.ie.NERClassifierCombiner.<init>(NERClassifierCombiner.java:136)
[error]     at edu.stanford.nlp.pipeline.NERCombinerAnnotator.<init>(NERCombinerAnnotator.java:91)
[error]     at edu.stanford.nlp.pipeline.AnnotatorImplementations.ner(AnnotatorImplementations.java:70)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getNamedAnnotators$44(StanfordCoreNLP.java:498)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getDefaultAnnotatorPool$65(StanfordCoreNLP.java:533)
[error]     at edu.stanford.nlp.util.Lazy$3.compute(Lazy.java:118)
[error]     at edu.stanford.nlp.util.Lazy.get(Lazy.java:31)
[error]     at edu.stanford.nlp.pipeline.AnnotatorPool.get(AnnotatorPool.java:146)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.construct(StanfordCoreNLP.java:447)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:150)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:146)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.newStanfordCoreNLP(ShallowNLPProcessor.scala:48)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.mkNer(ShallowNLPProcessor.scala:66)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner$lzycompute(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.recognizeNamedEntities(ShallowNLPProcessor.scala:198)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:89)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:86)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:59)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:56)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.wm.eidos.EidosSystem.annotate(EidosSystem.scala:170)
[error]     at org.clulab.wm.eidos.EidosSystem.extractFromText(EidosSystem.scala:193)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1(ExtractFromDirectory.scala:23)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1$adapted(ExtractFromDirectory.scala:16)
[error]     at scala.collection.parallel.mutable.ParArray$ParArrayIterator.foreach(ParArray.scala:142)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.leaf(ParIterableLike.scala:970)
[error]     at scala.collection.parallel.Task.$anonfun$tryLeaf$1(Tasks.scala:49)
[error]     at scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.java:12)
[error]     at scala.util.control.Breaks$$anon$1.catchBreak(Breaks.scala:63)
[error]     at scala.collection.parallel.Task.tryLeaf(Tasks.scala:52)
[error]     at scala.collection.parallel.Task.tryLeaf$(Tasks.scala:46)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.tryLeaf(ParIterableLike.scala:967)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute(Tasks.scala:149)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute$(Tasks.scala:145)
[error]     at scala.collection.parallel.AdaptiveWorkStealingForkJoinTasks$WrappedTask.compute(Tasks.scala:440)
[error]     at java.base/java.util.concurrent.RecursiveAction.exec(RecursiveAction.java:189)
[error]     at java.base/java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:290)
[error]     at java.base/java.util.concurrent.ForkJoinPool$WorkQueue.topLevelExec(ForkJoinPool.java:1020)
[error]     at java.base/java.util.concurrent.ForkJoinPool.scan(ForkJoinPool.java:1656)
[error]     at java.base/java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1594)
[error]     at java.base/java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:177)
[error] Caused by: edu.stanford.nlp.util.MetaClass$ClassCreationException: MetaClass couldn't create public edu.stanford.nlp.time.TimeExpressionExtractorImpl(java.lang.String,java.util.Properties) with args [sutime, {maxAdditionalKnownLCWords=0}]
[error]     at edu.stanford.nlp.util.MetaClass$ClassFactory.createInstance(MetaClass.java:237)
[error]     at edu.stanford.nlp.util.MetaClass.createInstance(MetaClass.java:382)
[error]     at edu.stanford.nlp.util.ReflectionLoading.loadByReflection(ReflectionLoading.java:38)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.create(TimeExpressionExtractorFactory.java:57)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.createExtractor(TimeExpressionExtractorFactory.java:38)
[error]     at edu.stanford.nlp.ie.regexp.NumberSequenceClassifier.<init>(NumberSequenceClassifier.java:86)
[error]     at edu.stanford.nlp.ie.NERClassifierCombiner.<init>(NERClassifierCombiner.java:136)
[error]     at edu.stanford.nlp.pipeline.NERCombinerAnnotator.<init>(NERCombinerAnnotator.java:91)
[error]     at edu.stanford.nlp.pipeline.AnnotatorImplementations.ner(AnnotatorImplementations.java:70)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getNamedAnnotators$44(StanfordCoreNLP.java:498)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getDefaultAnnotatorPool$65(StanfordCoreNLP.java:533)
[error]     at edu.stanford.nlp.util.Lazy$3.compute(Lazy.java:118)
[error]     at edu.stanford.nlp.util.Lazy.get(Lazy.java:31)
[error]     at edu.stanford.nlp.pipeline.AnnotatorPool.get(AnnotatorPool.java:146)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.construct(StanfordCoreNLP.java:447)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:150)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:146)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.newStanfordCoreNLP(ShallowNLPProcessor.scala:48)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.mkNer(ShallowNLPProcessor.scala:66)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner$lzycompute(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.recognizeNamedEntities(ShallowNLPProcessor.scala:198)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:89)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:86)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:59)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:56)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.wm.eidos.EidosSystem.annotate(EidosSystem.scala:170)
[error]     at org.clulab.wm.eidos.EidosSystem.extractFromText(EidosSystem.scala:193)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1(ExtractFromDirectory.scala:23)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1$adapted(ExtractFromDirectory.scala:16)
[error]     at scala.collection.parallel.mutable.ParArray$ParArrayIterator.foreach(ParArray.scala:142)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.leaf(ParIterableLike.scala:970)
[error]     at scala.collection.parallel.Task.$anonfun$tryLeaf$1(Tasks.scala:49)
[error]     at scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.java:12)
[error]     at scala.util.control.Breaks$$anon$1.catchBreak(Breaks.scala:63)
[error]     at scala.collection.parallel.Task.tryLeaf(Tasks.scala:52)
[error]     at scala.collection.parallel.Task.tryLeaf$(Tasks.scala:46)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.tryLeaf(ParIterableLike.scala:967)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute(Tasks.scala:149)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute$(Tasks.scala:145)
[error]     at scala.collection.parallel.AdaptiveWorkStealingForkJoinTasks$WrappedTask.compute(Tasks.scala:440)
[error]     at java.base/java.util.concurrent.RecursiveAction.exec(RecursiveAction.java:189)
[error]     at java.base/java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:290)
[error]     at java.base/java.util.concurrent.ForkJoinPool$WorkQueue.topLevelExec(ForkJoinPool.java:1020)
[error]     at java.base/java.util.concurrent.ForkJoinPool.scan(ForkJoinPool.java:1656)
[error]     at java.base/java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1594)
[error]     at java.base/java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:177)
[error] Caused by: java.lang.reflect.InvocationTargetException
[error]     at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
[error]     at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
[error]     at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
[error]     at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:490)
[error]     at edu.stanford.nlp.util.MetaClass$ClassFactory.createInstance(MetaClass.java:233)
[error]     at edu.stanford.nlp.util.MetaClass.createInstance(MetaClass.java:382)
[error]     at edu.stanford.nlp.util.ReflectionLoading.loadByReflection(ReflectionLoading.java:38)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.create(TimeExpressionExtractorFactory.java:57)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.createExtractor(TimeExpressionExtractorFactory.java:38)
[error]     at edu.stanford.nlp.ie.regexp.NumberSequenceClassifier.<init>(NumberSequenceClassifier.java:86)
[error]     at edu.stanford.nlp.ie.NERClassifierCombiner.<init>(NERClassifierCombiner.java:136)
[error]     at edu.stanford.nlp.pipeline.NERCombinerAnnotator.<init>(NERCombinerAnnotator.java:91)
[error]     at edu.stanford.nlp.pipeline.AnnotatorImplementations.ner(AnnotatorImplementations.java:70)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getNamedAnnotators$44(StanfordCoreNLP.java:498)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getDefaultAnnotatorPool$65(StanfordCoreNLP.java:533)
[error]     at edu.stanford.nlp.util.Lazy$3.compute(Lazy.java:118)
[error]     at edu.stanford.nlp.util.Lazy.get(Lazy.java:31)
[error]     at edu.stanford.nlp.pipeline.AnnotatorPool.get(AnnotatorPool.java:146)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.construct(StanfordCoreNLP.java:447)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:150)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:146)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.newStanfordCoreNLP(ShallowNLPProcessor.scala:48)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.mkNer(ShallowNLPProcessor.scala:66)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner$lzycompute(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.recognizeNamedEntities(ShallowNLPProcessor.scala:198)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:89)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:86)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:59)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:56)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.wm.eidos.EidosSystem.annotate(EidosSystem.scala:170)
[error]     at org.clulab.wm.eidos.EidosSystem.extractFromText(EidosSystem.scala:193)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1(ExtractFromDirectory.scala:23)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1$adapted(ExtractFromDirectory.scala:16)
[error]     at scala.collection.parallel.mutable.ParArray$ParArrayIterator.foreach(ParArray.scala:142)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.leaf(ParIterableLike.scala:970)
[error]     at scala.collection.parallel.Task.$anonfun$tryLeaf$1(Tasks.scala:49)
[error]     at scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.java:12)
[error]     at scala.util.control.Breaks$$anon$1.catchBreak(Breaks.scala:63)
[error]     at scala.collection.parallel.Task.tryLeaf(Tasks.scala:52)
[error]     at scala.collection.parallel.Task.tryLeaf$(Tasks.scala:46)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.tryLeaf(ParIterableLike.scala:967)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute(Tasks.scala:149)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute$(Tasks.scala:145)
[error]     at scala.collection.parallel.AdaptiveWorkStealingForkJoinTasks$WrappedTask.compute(Tasks.scala:440)
[error]     at java.base/java.util.concurrent.RecursiveAction.exec(RecursiveAction.java:189)
[error]     at java.base/java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:290)
[error]     at java.base/java.util.concurrent.ForkJoinPool$WorkQueue.topLevelExec(ForkJoinPool.java:1020)
[error]     at java.base/java.util.concurrent.ForkJoinPool.scan(ForkJoinPool.java:1656)
[error]     at java.base/java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1594)
[error]     at java.base/java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:177)
[error] Caused by: java.lang.RuntimeException: Error initializing binder 1
[error]     at edu.stanford.nlp.time.Options.<init>(Options.java:92)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorImpl.init(TimeExpressionExtractorImpl.java:44)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorImpl.<init>(TimeExpressionExtractorImpl.java:39)
[error]     at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
[error]     at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
[error]     at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
[error]     at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:490)
[error]     at edu.stanford.nlp.util.MetaClass$ClassFactory.createInstance(MetaClass.java:233)
[error]     at edu.stanford.nlp.util.MetaClass.createInstance(MetaClass.java:382)
[error]     at edu.stanford.nlp.util.ReflectionLoading.loadByReflection(ReflectionLoading.java:38)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.create(TimeExpressionExtractorFactory.java:57)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.createExtractor(TimeExpressionExtractorFactory.java:38)
[error]     at edu.stanford.nlp.ie.regexp.NumberSequenceClassifier.<init>(NumberSequenceClassifier.java:86)
[error]     at edu.stanford.nlp.ie.NERClassifierCombiner.<init>(NERClassifierCombiner.java:136)
[error]     at edu.stanford.nlp.pipeline.NERCombinerAnnotator.<init>(NERCombinerAnnotator.java:91)
[error]     at edu.stanford.nlp.pipeline.AnnotatorImplementations.ner(AnnotatorImplementations.java:70)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getNamedAnnotators$44(StanfordCoreNLP.java:498)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getDefaultAnnotatorPool$65(StanfordCoreNLP.java:533)
[error]     at edu.stanford.nlp.util.Lazy$3.compute(Lazy.java:118)
[error]     at edu.stanford.nlp.util.Lazy.get(Lazy.java:31)
[error]     at edu.stanford.nlp.pipeline.AnnotatorPool.get(AnnotatorPool.java:146)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.construct(StanfordCoreNLP.java:447)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:150)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:146)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.newStanfordCoreNLP(ShallowNLPProcessor.scala:48)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.mkNer(ShallowNLPProcessor.scala:66)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner$lzycompute(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.recognizeNamedEntities(ShallowNLPProcessor.scala:198)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:89)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:86)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:59)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:56)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.wm.eidos.EidosSystem.annotate(EidosSystem.scala:170)
[error]     at org.clulab.wm.eidos.EidosSystem.extractFromText(EidosSystem.scala:193)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1(ExtractFromDirectory.scala:23)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1$adapted(ExtractFromDirectory.scala:16)
[error]     at scala.collection.parallel.mutable.ParArray$ParArrayIterator.foreach(ParArray.scala:142)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.leaf(ParIterableLike.scala:970)
[error]     at scala.collection.parallel.Task.$anonfun$tryLeaf$1(Tasks.scala:49)
[error]     at scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.java:12)
[error]     at scala.util.control.Breaks$$anon$1.catchBreak(Breaks.scala:63)
[error]     at scala.collection.parallel.Task.tryLeaf(Tasks.scala:52)
[error]     at scala.collection.parallel.Task.tryLeaf$(Tasks.scala:46)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.tryLeaf(ParIterableLike.scala:967)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute(Tasks.scala:149)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute$(Tasks.scala:145)
[error]     at scala.collection.parallel.AdaptiveWorkStealingForkJoinTasks$WrappedTask.compute(Tasks.scala:440)
[error]     at java.base/java.util.concurrent.RecursiveAction.exec(RecursiveAction.java:189)
[error]     at java.base/java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:290)
[error]     at java.base/java.util.concurrent.ForkJoinPool$WorkQueue.topLevelExec(ForkJoinPool.java:1020)
[error]     at java.base/java.util.concurrent.ForkJoinPool.scan(ForkJoinPool.java:1656)
[error]     at java.base/java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1594)
[error]     at java.base/java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:177)
[error] Caused by: java.lang.IllegalStateException: Cannot instantiate configuration.
[error]     at de.jollyday.datasource.impl.XmlFileDataSource.getConfiguration(XmlFileDataSource.java:39)
[error]     at de.jollyday.impl.DefaultHolidayManager.doInit(DefaultHolidayManager.java:239)
[error]     at de.jollyday.HolidayManager.init(HolidayManager.java:319)
[error]     at de.jollyday.caching.HolidayManagerValueHandler.createValue(HolidayManagerValueHandler.java:44)
[error]     at de.jollyday.caching.HolidayManagerValueHandler.createValue(HolidayManagerValueHandler.java:13)
[error]     at de.jollyday.util.Cache.get(Cache.java:51)
[error]     at de.jollyday.HolidayManager.createManager(HolidayManager.java:168)
[error]     at de.jollyday.HolidayManager.getInstance(HolidayManager.java:148)
[error]     at edu.stanford.nlp.time.JollyDayHolidays.init(JollyDayHolidays.java:57)
[error]     at edu.stanford.nlp.time.Options.<init>(Options.java:90)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorImpl.init(TimeExpressionExtractorImpl.java:44)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorImpl.<init>(TimeExpressionExtractorImpl.java:39)
[error]     at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
[error]     at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
[error]     at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
[error]     at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:490)
[error]     at edu.stanford.nlp.util.MetaClass$ClassFactory.createInstance(MetaClass.java:233)
[error]     at edu.stanford.nlp.util.MetaClass.createInstance(MetaClass.java:382)
[error]     at edu.stanford.nlp.util.ReflectionLoading.loadByReflection(ReflectionLoading.java:38)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.create(TimeExpressionExtractorFactory.java:57)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.createExtractor(TimeExpressionExtractorFactory.java:38)
[error]     at edu.stanford.nlp.ie.regexp.NumberSequenceClassifier.<init>(NumberSequenceClassifier.java:86)
[error]     at edu.stanford.nlp.ie.NERClassifierCombiner.<init>(NERClassifierCombiner.java:136)
[error]     at edu.stanford.nlp.pipeline.NERCombinerAnnotator.<init>(NERCombinerAnnotator.java:91)
[error]     at edu.stanford.nlp.pipeline.AnnotatorImplementations.ner(AnnotatorImplementations.java:70)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getNamedAnnotators$44(StanfordCoreNLP.java:498)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getDefaultAnnotatorPool$65(StanfordCoreNLP.java:533)
[error]     at edu.stanford.nlp.util.Lazy$3.compute(Lazy.java:118)
[error]     at edu.stanford.nlp.util.Lazy.get(Lazy.java:31)
[error]     at edu.stanford.nlp.pipeline.AnnotatorPool.get(AnnotatorPool.java:146)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.construct(StanfordCoreNLP.java:447)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:150)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:146)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.newStanfordCoreNLP(ShallowNLPProcessor.scala:48)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.mkNer(ShallowNLPProcessor.scala:66)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner$lzycompute(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.recognizeNamedEntities(ShallowNLPProcessor.scala:198)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:89)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:86)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:59)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:56)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.wm.eidos.EidosSystem.annotate(EidosSystem.scala:170)
[error]     at org.clulab.wm.eidos.EidosSystem.extractFromText(EidosSystem.scala:193)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1(ExtractFromDirectory.scala:23)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1$adapted(ExtractFromDirectory.scala:16)
[error]     at scala.collection.parallel.mutable.ParArray$ParArrayIterator.foreach(ParArray.scala:142)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.leaf(ParIterableLike.scala:970)
[error]     at scala.collection.parallel.Task.$anonfun$tryLeaf$1(Tasks.scala:49)
[error]     at scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.java:12)
[error]     at scala.util.control.Breaks$$anon$1.catchBreak(Breaks.scala:63)
[error]     at scala.collection.parallel.Task.tryLeaf(Tasks.scala:52)
[error]     at scala.collection.parallel.Task.tryLeaf$(Tasks.scala:46)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.tryLeaf(ParIterableLike.scala:967)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute(Tasks.scala:149)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute$(Tasks.scala:145)
[error]     at scala.collection.parallel.AdaptiveWorkStealingForkJoinTasks$WrappedTask.compute(Tasks.scala:440)
[error]     at java.base/java.util.concurrent.RecursiveAction.exec(RecursiveAction.java:189)
[error]     at java.base/java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:290)
[error]     at java.base/java.util.concurrent.ForkJoinPool$WorkQueue.topLevelExec(ForkJoinPool.java:1020)
[error]     at java.base/java.util.concurrent.ForkJoinPool.scan(ForkJoinPool.java:1656)
[error]     at java.base/java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1594)
[error]     at java.base/java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:177)
[error] Caused by: java.lang.IllegalStateException: Cannot parse holidays XML file.
[error]     at de.jollyday.util.XMLUtil.unmarshallConfiguration(XMLUtil.java:78)
[error]     at de.jollyday.datasource.impl.XmlFileDataSource.getConfiguration(XmlFileDataSource.java:37)
[error]     at de.jollyday.impl.DefaultHolidayManager.doInit(DefaultHolidayManager.java:239)
[error]     at de.jollyday.HolidayManager.init(HolidayManager.java:319)
[error]     at de.jollyday.caching.HolidayManagerValueHandler.createValue(HolidayManagerValueHandler.java:44)
[error]     at de.jollyday.caching.HolidayManagerValueHandler.createValue(HolidayManagerValueHandler.java:13)
[error]     at de.jollyday.util.Cache.get(Cache.java:51)
[error]     at de.jollyday.HolidayManager.createManager(HolidayManager.java:168)
[error]     at de.jollyday.HolidayManager.getInstance(HolidayManager.java:148)
[error]     at edu.stanford.nlp.time.JollyDayHolidays.init(JollyDayHolidays.java:57)
[error]     at edu.stanford.nlp.time.Options.<init>(Options.java:90)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorImpl.init(TimeExpressionExtractorImpl.java:44)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorImpl.<init>(TimeExpressionExtractorImpl.java:39)
[error]     at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
[error]     at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
[error]     at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
[error]     at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:490)
[error]     at edu.stanford.nlp.util.MetaClass$ClassFactory.createInstance(MetaClass.java:233)
[error]     at edu.stanford.nlp.util.MetaClass.createInstance(MetaClass.java:382)
[error]     at edu.stanford.nlp.util.ReflectionLoading.loadByReflection(ReflectionLoading.java:38)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.create(TimeExpressionExtractorFactory.java:57)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.createExtractor(TimeExpressionExtractorFactory.java:38)
[error]     at edu.stanford.nlp.ie.regexp.NumberSequenceClassifier.<init>(NumberSequenceClassifier.java:86)
[error]     at edu.stanford.nlp.ie.NERClassifierCombiner.<init>(NERClassifierCombiner.java:136)
[error]     at edu.stanford.nlp.pipeline.NERCombinerAnnotator.<init>(NERCombinerAnnotator.java:91)
[error]     at edu.stanford.nlp.pipeline.AnnotatorImplementations.ner(AnnotatorImplementations.java:70)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getNamedAnnotators$44(StanfordCoreNLP.java:498)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getDefaultAnnotatorPool$65(StanfordCoreNLP.java:533)
[error]     at edu.stanford.nlp.util.Lazy$3.compute(Lazy.java:118)
[error]     at edu.stanford.nlp.util.Lazy.get(Lazy.java:31)
[error]     at edu.stanford.nlp.pipeline.AnnotatorPool.get(AnnotatorPool.java:146)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.construct(StanfordCoreNLP.java:447)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:150)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:146)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.newStanfordCoreNLP(ShallowNLPProcessor.scala:48)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.mkNer(ShallowNLPProcessor.scala:66)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner$lzycompute(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.recognizeNamedEntities(ShallowNLPProcessor.scala:198)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:89)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:86)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:59)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:56)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.wm.eidos.EidosSystem.annotate(EidosSystem.scala:170)
[error]     at org.clulab.wm.eidos.EidosSystem.extractFromText(EidosSystem.scala:193)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1(ExtractFromDirectory.scala:23)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1$adapted(ExtractFromDirectory.scala:16)
[error]     at scala.collection.parallel.mutable.ParArray$ParArrayIterator.foreach(ParArray.scala:142)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.leaf(ParIterableLike.scala:970)
[error]     at scala.collection.parallel.Task.$anonfun$tryLeaf$1(Tasks.scala:49)
[error]     at scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.java:12)
[error]     at scala.util.control.Breaks$$anon$1.catchBreak(Breaks.scala:63)
[error]     at scala.collection.parallel.Task.tryLeaf(Tasks.scala:52)
[error]     at scala.collection.parallel.Task.tryLeaf$(Tasks.scala:46)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.tryLeaf(ParIterableLike.scala:967)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute(Tasks.scala:149)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute$(Tasks.scala:145)
[error]     at scala.collection.parallel.AdaptiveWorkStealingForkJoinTasks$WrappedTask.compute(Tasks.scala:440)
[error]     at java.base/java.util.concurrent.RecursiveAction.exec(RecursiveAction.java:189)
[error]     at java.base/java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:290)
[error]     at java.base/java.util.concurrent.ForkJoinPool$WorkQueue.topLevelExec(ForkJoinPool.java:1020)
[error]     at java.base/java.util.concurrent.ForkJoinPool.scan(ForkJoinPool.java:1656)
[error]     at java.base/java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1594)
[error]     at java.base/java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:177)
[error] Caused by: javax.xml.bind.JAXBException: Provider com.sun.xml.internal.bind.v2.ContextFactory not found
[error]  - with linked exception:
[error] [java.lang.ClassNotFoundException: com.sun.xml.internal.bind.v2.ContextFactory]
[error]     at javax.xml.bind.ContextFinder.newInstance(ContextFinder.java:148)
[error]     at javax.xml.bind.ContextFinder.find(ContextFinder.java:361)
[error]     at javax.xml.bind.JAXBContext.newInstance(JAXBContext.java:446)
[error]     at javax.xml.bind.JAXBContext.newInstance(JAXBContext.java:409)
[error]     at de.jollyday.util.XMLUtil$JAXBContextCreator.create(XMLUtil.java:170)
[error]     at de.jollyday.util.XMLUtil.unmarshallConfiguration(XMLUtil.java:71)
[error]     at de.jollyday.datasource.impl.XmlFileDataSource.getConfiguration(XmlFileDataSource.java:37)
[error]     at de.jollyday.impl.DefaultHolidayManager.doInit(DefaultHolidayManager.java:239)
[error]     at de.jollyday.HolidayManager.init(HolidayManager.java:319)
[error]     at de.jollyday.caching.HolidayManagerValueHandler.createValue(HolidayManagerValueHandler.java:44)
[error]     at de.jollyday.caching.HolidayManagerValueHandler.createValue(HolidayManagerValueHandler.java:13)
[error]     at de.jollyday.util.Cache.get(Cache.java:51)
[error]     at de.jollyday.HolidayManager.createManager(HolidayManager.java:168)
[error]     at de.jollyday.HolidayManager.getInstance(HolidayManager.java:148)
[error]     at edu.stanford.nlp.time.JollyDayHolidays.init(JollyDayHolidays.java:57)
[error]     at edu.stanford.nlp.time.Options.<init>(Options.java:90)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorImpl.init(TimeExpressionExtractorImpl.java:44)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorImpl.<init>(TimeExpressionExtractorImpl.java:39)
[error]     at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
[error]     at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
[error]     at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
[error]     at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:490)
[error]     at edu.stanford.nlp.util.MetaClass$ClassFactory.createInstance(MetaClass.java:233)
[error]     at edu.stanford.nlp.util.MetaClass.createInstance(MetaClass.java:382)
[error]     at edu.stanford.nlp.util.ReflectionLoading.loadByReflection(ReflectionLoading.java:38)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.create(TimeExpressionExtractorFactory.java:57)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.createExtractor(TimeExpressionExtractorFactory.java:38)
[error]     at edu.stanford.nlp.ie.regexp.NumberSequenceClassifier.<init>(NumberSequenceClassifier.java:86)
[error]     at edu.stanford.nlp.ie.NERClassifierCombiner.<init>(NERClassifierCombiner.java:136)
[error]     at edu.stanford.nlp.pipeline.NERCombinerAnnotator.<init>(NERCombinerAnnotator.java:91)
[error]     at edu.stanford.nlp.pipeline.AnnotatorImplementations.ner(AnnotatorImplementations.java:70)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getNamedAnnotators$44(StanfordCoreNLP.java:498)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getDefaultAnnotatorPool$65(StanfordCoreNLP.java:533)
[error]     at edu.stanford.nlp.util.Lazy$3.compute(Lazy.java:118)
[error]     at edu.stanford.nlp.util.Lazy.get(Lazy.java:31)
[error]     at edu.stanford.nlp.pipeline.AnnotatorPool.get(AnnotatorPool.java:146)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.construct(StanfordCoreNLP.java:447)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:150)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:146)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.newStanfordCoreNLP(ShallowNLPProcessor.scala:48)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.mkNer(ShallowNLPProcessor.scala:66)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner$lzycompute(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.recognizeNamedEntities(ShallowNLPProcessor.scala:198)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:89)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:86)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:59)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:56)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.wm.eidos.EidosSystem.annotate(EidosSystem.scala:170)
[error]     at org.clulab.wm.eidos.EidosSystem.extractFromText(EidosSystem.scala:193)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1(ExtractFromDirectory.scala:23)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1$adapted(ExtractFromDirectory.scala:16)
[error]     at scala.collection.parallel.mutable.ParArray$ParArrayIterator.foreach(ParArray.scala:142)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.leaf(ParIterableLike.scala:970)
[error]     at scala.collection.parallel.Task.$anonfun$tryLeaf$1(Tasks.scala:49)
[error]     at scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.java:12)
[error]     at scala.util.control.Breaks$$anon$1.catchBreak(Breaks.scala:63)
[error]     at scala.collection.parallel.Task.tryLeaf(Tasks.scala:52)
[error]     at scala.collection.parallel.Task.tryLeaf$(Tasks.scala:46)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.tryLeaf(ParIterableLike.scala:967)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute(Tasks.scala:149)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute$(Tasks.scala:145)
[error]     at scala.collection.parallel.AdaptiveWorkStealingForkJoinTasks$WrappedTask.compute(Tasks.scala:440)
[error]     at java.base/java.util.concurrent.RecursiveAction.exec(RecursiveAction.java:189)
[error]     at java.base/java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:290)
[error]     at java.base/java.util.concurrent.ForkJoinPool$WorkQueue.topLevelExec(ForkJoinPool.java:1020)
[error]     at java.base/java.util.concurrent.ForkJoinPool.scan(ForkJoinPool.java:1656)
[error]     at java.base/java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1594)
[error]     at java.base/java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:177)
[error] Caused by: java.lang.ClassNotFoundException: com.sun.xml.internal.bind.v2.ContextFactory
[error]     at java.base/java.net.URLClassLoader.findClass(URLClassLoader.java:471)
[error]     at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:588)
[error]     at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:521)
[error]     at javax.xml.bind.ContextFinder.safeLoadClass(ContextFinder.java:573)
[error]     at javax.xml.bind.ContextFinder.newInstance(ContextFinder.java:145)
[error]     at javax.xml.bind.ContextFinder.find(ContextFinder.java:361)
[error]     at javax.xml.bind.JAXBContext.newInstance(JAXBContext.java:446)
[error]     at javax.xml.bind.JAXBContext.newInstance(JAXBContext.java:409)
[error]     at de.jollyday.util.XMLUtil$JAXBContextCreator.create(XMLUtil.java:170)
[error]     at de.jollyday.util.XMLUtil.unmarshallConfiguration(XMLUtil.java:71)
[error]     at de.jollyday.datasource.impl.XmlFileDataSource.getConfiguration(XmlFileDataSource.java:37)
[error]     at de.jollyday.impl.DefaultHolidayManager.doInit(DefaultHolidayManager.java:239)
[error]     at de.jollyday.HolidayManager.init(HolidayManager.java:319)
[error]     at de.jollyday.caching.HolidayManagerValueHandler.createValue(HolidayManagerValueHandler.java:44)
[error]     at de.jollyday.caching.HolidayManagerValueHandler.createValue(HolidayManagerValueHandler.java:13)
[error]     at de.jollyday.util.Cache.get(Cache.java:51)
[error]     at de.jollyday.HolidayManager.createManager(HolidayManager.java:168)
[error]     at de.jollyday.HolidayManager.getInstance(HolidayManager.java:148)
[error]     at edu.stanford.nlp.time.JollyDayHolidays.init(JollyDayHolidays.java:57)
[error]     at edu.stanford.nlp.time.Options.<init>(Options.java:90)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorImpl.init(TimeExpressionExtractorImpl.java:44)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorImpl.<init>(TimeExpressionExtractorImpl.java:39)
[error]     at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
[error]     at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
[error]     at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
[error]     at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:490)
[error]     at edu.stanford.nlp.util.MetaClass$ClassFactory.createInstance(MetaClass.java:233)
[error]     at edu.stanford.nlp.util.MetaClass.createInstance(MetaClass.java:382)
[error]     at edu.stanford.nlp.util.ReflectionLoading.loadByReflection(ReflectionLoading.java:38)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.create(TimeExpressionExtractorFactory.java:57)
[error]     at edu.stanford.nlp.time.TimeExpressionExtractorFactory.createExtractor(TimeExpressionExtractorFactory.java:38)
[error]     at edu.stanford.nlp.ie.regexp.NumberSequenceClassifier.<init>(NumberSequenceClassifier.java:86)
[error]     at edu.stanford.nlp.ie.NERClassifierCombiner.<init>(NERClassifierCombiner.java:136)
[error]     at edu.stanford.nlp.pipeline.NERCombinerAnnotator.<init>(NERCombinerAnnotator.java:91)
[error]     at edu.stanford.nlp.pipeline.AnnotatorImplementations.ner(AnnotatorImplementations.java:70)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getNamedAnnotators$44(StanfordCoreNLP.java:498)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getDefaultAnnotatorPool$65(StanfordCoreNLP.java:533)
[error]     at edu.stanford.nlp.util.Lazy$3.compute(Lazy.java:118)
[error]     at edu.stanford.nlp.util.Lazy.get(Lazy.java:31)
[error]     at edu.stanford.nlp.pipeline.AnnotatorPool.get(AnnotatorPool.java:146)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.construct(StanfordCoreNLP.java:447)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:150)
[error]     at edu.stanford.nlp.pipeline.StanfordCoreNLP.<init>(StanfordCoreNLP.java:146)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.newStanfordCoreNLP(ShallowNLPProcessor.scala:48)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.mkNer(ShallowNLPProcessor.scala:66)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner$lzycompute(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.ner(ShallowNLPProcessor.scala:41)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.recognizeNamedEntities(ShallowNLPProcessor.scala:198)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:89)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:86)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.processors.Processor.annotate(Processor.scala:59)
[error]     at org.clulab.processors.Processor.annotate$(Processor.scala:56)
[error]     at org.clulab.processors.shallownlp.ShallowNLPProcessor.annotate(ShallowNLPProcessor.scala:29)
[error]     at org.clulab.wm.eidos.EidosSystem.annotate(EidosSystem.scala:170)
[error]     at org.clulab.wm.eidos.EidosSystem.extractFromText(EidosSystem.scala:193)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1(ExtractFromDirectory.scala:23)
[error]     at org.clulab.wm.eidos.apps.ExtractFromDirectory$.$anonfun$new$1$adapted(ExtractFromDirectory.scala:16)
[error]     at scala.collection.parallel.mutable.ParArray$ParArrayIterator.foreach(ParArray.scala:142)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.leaf(ParIterableLike.scala:970)
[error]     at scala.collection.parallel.Task.$anonfun$tryLeaf$1(Tasks.scala:49)
[error]     at scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.java:12)
[error]     at scala.util.control.Breaks$$anon$1.catchBreak(Breaks.scala:63)
[error]     at scala.collection.parallel.Task.tryLeaf(Tasks.scala:52)
[error]     at scala.collection.parallel.Task.tryLeaf$(Tasks.scala:46)
[error]     at scala.collection.parallel.ParIterableLike$Foreach.tryLeaf(ParIterableLike.scala:967)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute(Tasks.scala:149)
[error]     at scala.collection.parallel.AdaptiveWorkStealingTasks$WrappedTask.compute$(Tasks.scala:145)
[error]     at scala.collection.parallel.AdaptiveWorkStealingForkJoinTasks$WrappedTask.compute(Tasks.scala:440)
[error]     at java.base/java.util.concurrent.RecursiveAction.exec(RecursiveAction.java:189)
[error]     at java.base/java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:290)
[error]     at java.base/java.util.concurrent.ForkJoinPool$WorkQueue.topLevelExec(ForkJoinPool.java:1020)
[error]     at java.base/java.util.concurrent.ForkJoinPool.scan(ForkJoinPool.java:1656)
[error]     at java.base/java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1594)
[error]     at java.base/java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:177)
[error] java.lang.RuntimeException: Nonzero exit code: 1
[error]     at sbt.Run$.executeTrapExit(Run.scala:124)
[error]     at sbt.Run.run(Run.scala:77)
[error]     at sbt.Defaults$.$anonfun$bgRunMainTask$6(Defaults.scala:1163)
[error]     at sbt.Defaults$.$anonfun$bgRunMainTask$6$adapted(Defaults.scala:1158)
[error]     at sbt.internal.BackgroundThreadPool.$anonfun$run$1(DefaultBackgroundJobService.scala:366)
[error]     at scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.java:12)
[error]     at scala.util.Try$.apply(Try.scala:209)
[error]     at sbt.internal.BackgroundThreadPool$BackgroundRunnable.run(DefaultBackgroundJobService.scala:289)
[error]     at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)
[error]     at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)
[error]     at java.base/java.lang.Thread.run(Thread.java:834)
[error] (Compile / runMain) Nonzero exit code: 1
[error] Total time: 31 s, completed Oct 10, 2018, 2:49:19 PM
[INFO] [10/10/2018 14:49:19.336] [Thread-7] [CoordinatedShutdown(akka://sbt-web)] Starting coordinated shutdown from JVM shutdown hook
```

## Webapp

If you're looking for a GUI to enter text into and get results do:

`sbt webapp/run`

...and then head to a browser and head to `localhost:9000`.


* Ran with `sbt webapp/run`
* Hung at `[info] Updating ProjectRef(uri("file:/Users/brandon/repos/eidos/project/"), "eidos-build")…` for several minutes with no progress then proceeded
* Threw error `[error] Unable to find credentials for [JitPack @ jitpack.io].`, however this did not stop the installation/run of the webapp
* Ultimately, the webapp ran.
* Was able to access it at `localhost:9000`
* Entered text "Water trucking has decreased due to the cost of fuel."
* Webapp threw error popup
* Logs revealed the following error:

Error:

```
Processing sentence : Water trucking has decreased due to the cost of fuel.
[warn] d.j.u.XMLUtil - Could not create JAXB context using the current threads context classloader. Defaulting to ObjectFactory classloader.
Caught NER exception!
Document:
org.clulab.processors.corenlp.CoreNLPDocument@3111dc8a
[error] application -

! @79gfa9o08 - Internal server error, for (GET) [/parseText?text=Water+trucking+has+decreased+due+to+the+cost+of+fuel.&cagRelevantOnly=false] ->

play.api.http.HttpErrorHandlerExceptions$$anon$1: Execution exception[[ReflectionLoadingException: Error creating edu.stanford.nlp.time.TimeExpressionExtractorImpl]]
    at play.api.http.HttpErrorHandlerExceptions$.throwableToUsefulException(HttpErrorHandler.scala:255)
    at play.api.http.DefaultHttpErrorHandler.onServerError(HttpErrorHandler.scala:182)
    at play.core.server.AkkaHttpServer$$anonfun$$nestedInanonfun$executeHandler$1$1.applyOrElse(AkkaHttpServer.scala:251)
    at play.core.server.AkkaHttpServer$$anonfun$$nestedInanonfun$executeHandler$1$1.applyOrElse(AkkaHttpServer.scala:250)
    at scala.concurrent.Future.$anonfun$recoverWith$1(Future.scala:414)
    at scala.concurrent.impl.Promise.$anonfun$transformWith$1(Promise.scala:37)
    at scala.concurrent.impl.CallbackRunnable.run(Promise.scala:60)
    at play.api.libs.streams.Execution$trampoline$.execute(Execution.scala:70)
    at scala.concurrent.impl.CallbackRunnable.executeWithValue(Promise.scala:68)
    at scala.concurrent.impl.Promise$KeptPromise$Kept.onComplete(Promise.scala:368)
Caused by: edu.stanford.nlp.util.ReflectionLoading$ReflectionLoadingException: Error creating edu.stanford.nlp.time.TimeExpressionExtractorImpl
    at edu.stanford.nlp.util.ReflectionLoading.loadByReflection(ReflectionLoading.java:40)
    at edu.stanford.nlp.time.TimeExpressionExtractorFactory.create(TimeExpressionExtractorFactory.java:57)
    at edu.stanford.nlp.time.TimeExpressionExtractorFactory.createExtractor(TimeExpressionExtractorFactory.java:38)
    at edu.stanford.nlp.ie.regexp.NumberSequenceClassifier.<init>(NumberSequenceClassifier.java:86)
    at edu.stanford.nlp.ie.NERClassifierCombiner.<init>(NERClassifierCombiner.java:136)
    at edu.stanford.nlp.pipeline.NERCombinerAnnotator.<init>(NERCombinerAnnotator.java:91)
    at edu.stanford.nlp.pipeline.AnnotatorImplementations.ner(AnnotatorImplementations.java:70)
    at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getNamedAnnotators$44(StanfordCoreNLP.java:498)
    at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getDefaultAnnotatorPool$65(StanfordCoreNLP.java:533)
    at edu.stanford.nlp.util.Lazy$3.compute(Lazy.java:118)
Caused by: edu.stanford.nlp.util.MetaClass$ClassCreationException: MetaClass couldn't create public edu.stanford.nlp.time.TimeExpressionExtractorImpl(java.lang.String,java.util.Properties) with args [sutime, {maxAdditionalKnownLCWords=0}]
    at edu.stanford.nlp.util.MetaClass$ClassFactory.createInstance(MetaClass.java:237)
    at edu.stanford.nlp.util.MetaClass.createInstance(MetaClass.java:382)
    at edu.stanford.nlp.util.ReflectionLoading.loadByReflection(ReflectionLoading.java:38)
    at edu.stanford.nlp.time.TimeExpressionExtractorFactory.create(TimeExpressionExtractorFactory.java:57)
    at edu.stanford.nlp.time.TimeExpressionExtractorFactory.createExtractor(TimeExpressionExtractorFactory.java:38)
    at edu.stanford.nlp.ie.regexp.NumberSequenceClassifier.<init>(NumberSequenceClassifier.java:86)
    at edu.stanford.nlp.ie.NERClassifierCombiner.<init>(NERClassifierCombiner.java:136)
    at edu.stanford.nlp.pipeline.NERCombinerAnnotator.<init>(NERCombinerAnnotator.java:91)
    at edu.stanford.nlp.pipeline.AnnotatorImplementations.ner(AnnotatorImplementations.java:70)
    at edu.stanford.nlp.pipeline.StanfordCoreNLP.lambda$getNamedAnnotators$44(StanfordCoreNLP.java:498)
Caused by: java.lang.reflect.InvocationTargetException: null
    at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
    at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
    at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
    at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:490)
    at edu.stanford.nlp.util.MetaClass$ClassFactory.createInstance(MetaClass.java:233)
    at edu.stanford.nlp.util.MetaClass.createInstance(MetaClass.java:382)
    at edu.stanford.nlp.util.ReflectionLoading.loadByReflection(ReflectionLoading.java:38)
    at edu.stanford.nlp.time.TimeExpressionExtractorFactory.create(TimeExpressionExtractorFactory.java:57)
    at edu.stanford.nlp.time.TimeExpressionExtractorFactory.createExtractor(TimeExpressionExtractorFactory.java:38)
    at edu.stanford.nlp.ie.regexp.NumberSequenceClassifier.<init>(NumberSequenceClassifier.java:86)
Caused by: java.lang.RuntimeException: Error initializing binder 1
    at edu.stanford.nlp.time.Options.<init>(Options.java:92)
    at edu.stanford.nlp.time.TimeExpressionExtractorImpl.init(TimeExpressionExtractorImpl.java:44)
    at edu.stanford.nlp.time.TimeExpressionExtractorImpl.<init>(TimeExpressionExtractorImpl.java:39)
    at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
    at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
    at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
    at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:490)
    at edu.stanford.nlp.util.MetaClass$ClassFactory.createInstance(MetaClass.java:233)
    at edu.stanford.nlp.util.MetaClass.createInstance(MetaClass.java:382)
    at edu.stanford.nlp.util.ReflectionLoading.loadByReflection(ReflectionLoading.java:38)
Caused by: java.lang.IllegalStateException: Cannot instantiate configuration.
    at de.jollyday.datasource.impl.XmlFileDataSource.getConfiguration(XmlFileDataSource.java:39)
    at de.jollyday.impl.DefaultHolidayManager.doInit(DefaultHolidayManager.java:239)
    at de.jollyday.HolidayManager.init(HolidayManager.java:319)
    at de.jollyday.caching.HolidayManagerValueHandler.createValue(HolidayManagerValueHandler.java:44)
    at de.jollyday.caching.HolidayManagerValueHandler.createValue(HolidayManagerValueHandler.java:13)
    at de.jollyday.util.Cache.get(Cache.java:51)
    at de.jollyday.HolidayManager.createManager(HolidayManager.java:168)
    at de.jollyday.HolidayManager.getInstance(HolidayManager.java:148)
    at edu.stanford.nlp.time.JollyDayHolidays.init(JollyDayHolidays.java:57)
    at edu.stanford.nlp.time.Options.<init>(Options.java:90)
Caused by: java.lang.IllegalStateException: Cannot parse holidays XML file.
    at de.jollyday.util.XMLUtil.unmarshallConfiguration(XMLUtil.java:78)
    at de.jollyday.datasource.impl.XmlFileDataSource.getConfiguration(XmlFileDataSource.java:37)
    at de.jollyday.impl.DefaultHolidayManager.doInit(DefaultHolidayManager.java:239)
    at de.jollyday.HolidayManager.init(HolidayManager.java:319)
    at de.jollyday.caching.HolidayManagerValueHandler.createValue(HolidayManagerValueHandler.java:44)
    at de.jollyday.caching.HolidayManagerValueHandler.createValue(HolidayManagerValueHandler.java:13)
    at de.jollyday.util.Cache.get(Cache.java:51)
    at de.jollyday.HolidayManager.createManager(HolidayManager.java:168)
    at de.jollyday.HolidayManager.getInstance(HolidayManager.java:148)
    at edu.stanford.nlp.time.JollyDayHolidays.init(JollyDayHolidays.java:57)
Caused by: javax.xml.bind.JAXBException: Provider com.sun.xml.internal.bind.v2.ContextFactory not found
    at javax.xml.bind.ContextFinder.newInstance(ContextFinder.java:148)
    at javax.xml.bind.ContextFinder.find(ContextFinder.java:361)
    at javax.xml.bind.JAXBContext.newInstance(JAXBContext.java:446)
    at javax.xml.bind.JAXBContext.newInstance(JAXBContext.java:409)
    at de.jollyday.util.XMLUtil$JAXBContextCreator.create(XMLUtil.java:170)
    at de.jollyday.util.XMLUtil.unmarshallConfiguration(XMLUtil.java:71)
    at de.jollyday.datasource.impl.XmlFileDataSource.getConfiguration(XmlFileDataSource.java:37)
    at de.jollyday.impl.DefaultHolidayManager.doInit(DefaultHolidayManager.java:239)
    at de.jollyday.HolidayManager.init(HolidayManager.java:319)
    at de.jollyday.caching.HolidayManagerValueHandler.createValue(HolidayManagerValueHandler.java:44)
Caused by: java.lang.ClassNotFoundException: com.sun.xml.internal.bind.v2.ContextFactory
    at java.base/java.net.URLClassLoader.findClass(URLClassLoader.java:471)
    at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:588)
    at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:521)
    at javax.xml.bind.ContextFinder.safeLoadClass(ContextFinder.java:573)
    at javax.xml.bind.ContextFinder.newInstance(ContextFinder.java:145)
    at javax.xml.bind.ContextFinder.find(ContextFinder.java:361)
    at javax.xml.bind.JAXBContext.newInstance(JAXBContext.java:446)
    at javax.xml.bind.JAXBContext.newInstance(JAXBContext.java:409)
    at de.jollyday.util.XMLUtil$JAXBContextCreator.create(XMLUtil.java:170)
    at de.jollyday.util.XMLUtil.unmarshallConfiguration(XMLUtil.java:71)
```

## INDRA Invocation

**Useful links for install (only use if below instructions fail you)**:

* [Decent instructions hidden in `indra/sources/eidos/__init__.py`](https://github.com/sorgerlab/indra/blob/master/indra/sources/eidos/__init__.py)
* [pyjnius Java issue](https://github.com/kivy/pyjnius/issues/277)
* [pyjnius install](https://pyjnius.readthedocs.io/en/latest/)

### Instructions

**Environment Set Up**

```
conda create -n indra_env python=3.7 pip
source activate indra_env
pip install --upgrade pip
pip install Cython
pip install git+https://github.com/sorgerlab/indra.git

# Eventually use this
pip freeze > requirements.txt
```

**Actual Install**

* Make sure JDK and JRE are installed and JDK_HOME and JRE_HOME environment variables are set.
* Install `pyjnius` python package with `pip install pyjnius`
* Test the install with starting a python REPL.  You may encounter:
```
>>> import jnius
No Java runtime present, requesting install.
```
* If you do, it might be solved by adding `<string>JNI</string>` to `JVMCapabilities` in `/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Info.plist`
* For eidos to provide grounding information to be included in INDRA Statements, the eidos configuration needs to be adjusted. So...
* Download vectors.txt from
https://s3.amazonaws.com/world-modelers/data/vectors.txt and put it in a folder called `src/main/resources/org/clulab/wm/eidos/english/w2v`
* Set the property "useW2V" to true in `src/main/resources/eidos.conf`
* Rerun `sbt assembly`
* Set the absolute path to the JAR file to the EIDOSPATH environment variable `export EIDOSPATH="/fullpath/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar"`
* Append EIDOSPATH to the CLASSPATH environmental variable (entries are separated by colons). `export CLASSPATH="$EIDOSPATH:$CLASSPATH"`


With these, I was able to get integration with INDRA set up such that the python code runs, however output is not the same as in the documentation:

```
>>> from indra.sources import eidos
>>> ep = eidos.process_text("Water trucking has decreased due to the cost of fuel.")
Loading processor...
Loading W2V...
13:15:34.451 [main] INFO  org.clulab.wm.eidos.utils.Sourcer$ - Sourcing resource file:/Users/jgawrilow/j/WM/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar!/org/clulab/wm/eidos/english/filtering/stops.txt
13:15:34.518 [main] INFO  org.clulab.wm.eidos.utils.Sourcer$ - Sourcing resource file:/Users/jgawrilow/j/WM/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar!/org/clulab/wm/eidos/english/filtering/transparent.txt
13:15:34.527 [main] INFO  org.clulab.wm.eidos.utils.Sourcer$ - Sourcing resource file:/Users/jgawrilow/j/WM/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar!/org/clulab/wm/eidos/english/confidence/hedging.txt
13:15:34.532 [main] INFO  o.c.w.e.groundings.EidosWordToVec$ - Loading w2v from /org/clulab/wm/eidos/english/w2v/vectors.txt...
13:15:34.535 [main] DEBUG o.c.w.e.groundings.CompactWord2Vec - Started to load word2vec matrix from file /org/clulab/wm/eidos/english/w2v/vectors.txt...
13:15:34.536 [main] INFO  org.clulab.wm.eidos.utils.Sourcer$ - Sourcing resource file:/Users/jgawrilow/j/WM/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar!/org/clulab/wm/eidos/english/w2v/vectors.txt
13:16:26.948 [main] DEBUG o.c.w.e.groundings.CompactWord2Vec - Completed matrix loading.
Loading loadableAttributes...
13:16:26.954 [main] INFO  org.clulab.wm.eidos.utils.Sourcer$ - Sourcing resource file:/Users/jgawrilow/j/WM/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar!/org/clulab/wm/eidos/english/grammars/master.yml
13:16:26.967 [main] INFO  org.clulab.wm.eidos.utils.Sourcer$ - Sourcing resource file:/Users/jgawrilow/j/WM/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar!/org/clulab/wm/eidos/english/grammars/taxonomy.yml
13:16:27.253 [scala-execution-context-global-11] INFO  o.c.w.e.groundings.DomainOntologies$ - Processing yml ontology /org/clulab/wm/eidos/english/ontologies/fao_variable_ontology.yml..
13:16:27.253 [scala-execution-context-global-10] INFO  o.c.w.e.groundings.DomainOntologies$ - Processing yml ontology /org/clulab/wm/eidos/english/ontologies/wdi_ontology.yml..
13:16:27.253 [scala-execution-context-global-9] INFO  o.c.w.e.groundings.DomainOntologies$ - Processing yml ontology /org/clulab/wm/eidos/english/ontologies/un_ontology.yml..
13:16:27.260 [scala-execution-context-global-11] INFO  org.clulab.wm.eidos.utils.Sourcer$ - Sourcing resource file:/Users/jgawrilow/j/WM/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar!/org/clulab/wm/eidos/english/ontologies/fao_variable_ontology.yml
13:16:27.260 [scala-execution-context-global-9] INFO  org.clulab.wm.eidos.utils.Sourcer$ - Sourcing resource file:/Users/jgawrilow/j/WM/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar!/org/clulab/wm/eidos/english/ontologies/un_ontology.yml
13:16:27.260 [scala-execution-context-global-10] INFO  org.clulab.wm.eidos.utils.Sourcer$ - Sourcing resource file:/Users/jgawrilow/j/WM/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar!/org/clulab/wm/eidos/english/ontologies/wdi_ontology.yml
13:16:27.985 [scala-execution-context-global-9] INFO  e.s.nlp.pipeline.StanfordCoreNLP - Adding annotator pos
13:16:29.013 [scala-execution-context-global-9] INFO  e.s.nlp.tagger.maxent.MaxentTagger - Loading POS tagger from edu/stanford/nlp/models/pos-tagger/english-left3words/english-left3words-distsim.tagger ... done [1.0 sec].
13:16:29.072 [scala-execution-context-global-10] INFO  e.s.nlp.pipeline.StanfordCoreNLP - Adding annotator lemma
13:16:29.162 [scala-execution-context-global-9] INFO  e.s.nlp.pipeline.StanfordCoreNLP - Adding annotator ner
13:16:29.213 [scala-execution-context-global-9] INFO  e.s.nlp.sequences.SeqClassifierFlags - maxAdditionalKnownLCWords=0
13:16:30.576 [scala-execution-context-global-9] INFO  e.s.n.ie.AbstractSequenceClassifier - Loading classifier from edu/stanford/nlp/models/ner/english.all.3class.distsim.crf.ser.gz ... done [1.3 sec].
13:16:31.053 [scala-execution-context-global-9] INFO  e.s.n.ie.AbstractSequenceClassifier - Loading classifier from edu/stanford/nlp/models/ner/english.muc.7class.distsim.crf.ser.gz ... done [0.5 sec].
13:16:31.634 [scala-execution-context-global-9] INFO  e.s.n.ie.AbstractSequenceClassifier - Loading classifier from edu/stanford/nlp/models/ner/english.conll.4class.distsim.crf.ser.gz ... done [0.6 sec].
13:16:31.645 [scala-execution-context-global-9] INFO  e.stanford.nlp.time.JollyDayHolidays - Initializing JollyDayHoliday for SUTime from classpath edu/stanford/nlp/models/sutime/jollyday/Holidays_sutime.xml as sutime.binder.1.
13:16:36.071 [scala-execution-context-global-9] DEBUG e.s.n.l.t.CoreMapExpressionExtractor - Ignoring inactive rule: null
13:16:36.072 [scala-execution-context-global-9] DEBUG e.s.n.l.t.CoreMapExpressionExtractor - Ignoring inactive rule: temporal-composite-8:ranges
13:17:41.836 [main] INFO  org.clulab.wm.eidos.utils.Sourcer$ - Sourcing resource file:/Users/jgawrilow/j/WM/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar!/org/clulab/wm/eidos/english/grammars/entities/grammar/entities.yml
13:17:44.575 [main] INFO  org.clulab.wm.eidos.utils.Sourcer$ - Sourcing resource file:/Users/jgawrilow/j/WM/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar!/org/clulab/wm/eidos/english/grammars/avoidLocal.yml
13:17:44.632 [main] INFO  org.clulab.wm.eidos.utils.Sourcer$ - Sourcing resource file:/Users/jgawrilow/j/WM/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar!/org/clulab/wm/eidos/english/quantifierKB/domain_parameters.kb
13:17:44.635 [main] INFO  org.clulab.wm.eidos.utils.Sourcer$ - Sourcing resource file:/Users/jgawrilow/j/WM/eidos/target/scala-2.12/eidos-assembly-0.2.2-SNAPSHOT.jar!/org/clulab/wm/eidos/english/quantifierKB/gradable_adj_fullmodel.kb

# Issue here???? #
13:17:45.361 [main] INFO  org.clulab.sequences.LexiconNER - Beginning to load the KBs for the rule-based bio NER...**


13:17:45.368 [main] INFO  org.clulab.sequences.LexiconNER - Loaded matcher for label Quantifier. This matcher contains 219 unique strings; the size of the first layer is 219.
13:17:45.369 [main] INFO  org.clulab.sequences.LexiconNER - Loaded matcher for label Property. This matcher contains 73 unique strings; the size of the first layer is 73.
13:17:45.369 [main] INFO  org.clulab.sequences.LexiconNER - KB loading completed.
13:17:45.467 [main] INFO  e.s.n.parser.nndep.DependencyParser - Loading depparse model file: edu/stanford/nlp/models/parser/nndep/english_UD.gz ...
13:18:01.861 [main] INFO  e.s.nlp.parser.nndep.Classifier - PreComputed 99996, Elapsed Time: 15.464 (s)
13:18:01.861 [main] INFO  e.s.n.parser.nndep.DependencyParser - Initializing dependency parser ... done [16.4 sec].
13:18:02.009 [main] INFO  e.s.nlp.sequences.SeqClassifierFlags - macro=true
13:18:02.009 [main] INFO  e.s.nlp.sequences.SeqClassifierFlags - featureCountThresh=10
13:18:02.010 [main] INFO  e.s.nlp.sequences.SeqClassifierFlags - featureFactory=org.clulab.processors.corenlp.chunker.ChunkingFeatureFactory
>>> ep.statements
[]
```


Installed INDRA with the following:

```
git clone git@github.com:sorgerlab/indra
cd indra
pip install .
```

Updated `~/.config/indra/config.ini` file to set `EIDOSPATH` to the location of the Eidos JAR which was previously compiled. Then, in Python, ran:

```
import indra
indra.config.get_config('EIDOSPATH')
```
 
This returned the path which was specified in the `config.ini` file. However, the following returned an error:

```
from indra.sources import eidos
```

Returned this error:

```
WARNING: [2018-10-10 15:45:30] indra/eidos - Could not instantiate Eidos reader, text reading will not be available.
```

This is likely due to the aforementioned issues encountered with this currently compiled version of INDRA.
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTI4NTEzMzY3MCwtMTQxNzA2NTkzNiw2Mj
U2MTQ3MDUsLTMzOTQ3OTM4MSwtMTEwNTAyMDUxOSwtMTcwMDQ0
NzE1NCwtODEyNDI0OTddfQ==
-->