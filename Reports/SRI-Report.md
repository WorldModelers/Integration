# SRI Components

* Analysis Date: 11/3/2018


* System: MacOS 10.13.6
* Scala Version: 2.12.7
* Java Version: Oracle java version 1.8.0_71

# Contents
* [Background](#background)
* [General Findings](#general-findings)
* [Documentation](#documentation)
* [Installation](#installation)
* [Running](#running)

# Background

From Rodrigo:
* https://github.com/aic-sri-international/aic-praise-wm is the correct repository although it's out of date.  They maintain their own private repo which we can get access to.  The 'base work' is done here: https://github.com/aic-sri-international/aic-praise which relies on https://github.com/aic-sri-international/aic-expresso and https://github.com/aic-sri-international/aic-util.

* UCSB’s CHIRTS system is not open source, but it can be accessed through a REST API described in the following document: https://docs.google.com/document/d/1J-WtKoGr4nVrxvQTo-qk9Ce66_CSum5h4YDJMWvPBtA/edit#  They access the CHIRPS REST API, although they do it through the MINT data catalog system kept by ISI.

* SRI is also are working with Stanford to use their own systems and create a unified repository. This is the one for crop yield forecast (it is still in the process of being set up): https://github.com/min-yin-sri/deep-transfer-learning-crop-prediction

* As of now, they don’t produce data that others consume, because the system is meant to be for the end user. However, eventually they should register our system in the MINT model catalog so it’s available to everybody.


# General Findings
* The 'Overview and Demo' and 'Latest Release' links are broken on this page: https://github.com/aic-sri-international/aic-praise-wm perhaps pointing to internal things.  There also seems to be only five source files here so probably not worth looking at until it's updated or we get access.

* https://github.com/aic-sri-international/aic-praise has much much more and the 'dev' branch was updated 14 days ago, although the last release was a year ago.  The 'Overview and Demo' link here is very clean - http://aic-sri-international.github.io/aic-praise/.  This repo 'implements the ideas presented in this paper: http://www.ai.sri.com/~braz/papers/PIMT.pdf and the repo depends on capabilities provided by the Expresso Library: http://aic-sri-international.github.io/aic-expresso/

## Documentation





# Installation:

https://github.com/aic-sri-international/aic-praise seems to be the thing to get started with.

Will follow the (command line instructions) here: https://github.com/aic-sri-international/aic-praise/wiki/Getting-Started.

https://github.com/aic-sri-international/aic-praise/blob/dev/examples/food%20security%20-%20july%202018%20demo.praise seems to be the example laid out at the PI meeting.

```
git clone https://github.com/aic-sri-international/aic-praise.git
mvn clean test
```

This gave me 22 warnings and the following error:

```
[ERROR] COMPILATION ERROR :
[INFO] -------------------------------------------------------------
[ERROR]  javafx.fxml.FXML,javafx.beans.DefaultProperty,com.sun.javafx.beans.IDProperty,com.google.common.annotations.Beta
/Users/jgawrilow/j/WM/sri/aic-praise/src/main/java/com/sri/ai/praise/core/inference/byinputrepresentation/interfacebased/core/exactbp/eager/core/AbstractExactBPNode.java:[215,1] error: method does not override or implement a method from a supertype
[ERROR] /Users/jgawrilow/j/WM/sri/aic-praise/src/main/java/com/sri/ai/praise/core/inference/byinputrepresentation/interfacebased/core/exactbp/eager/core/ExactBPNodeFromVariableToFactor.java:[55,7] error: ExactBPNodeFromVariableToFactor is not abstract and does not override abstract method makeNewEvaluator() in TreeComputation
[ERROR] /Users/jgawrilow/j/WM/sri/aic-praise/src/main/java/com/sri/ai/praise/core/inference/byinputrepresentation/interfacebased/core/exactbp/eager/core/ExactBPNodeFromFactorToVariable.java:[55,7] error: ExactBPNodeFromFactorToVariable is not abstract and does not override abstract method makeNewEvaluator() in TreeComputation
[INFO] 3 errors
[INFO] -------------------------------------------------------------
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 25.030 s
[INFO] Finished at: 2018-11-04T19:39:33-05:00
[INFO] Final Memory: 21M/283M
[INFO] ------------------------------------------------------------------------
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:2.3.2:compile (default-compile) on project aic-praise: Compilation failure: Compilation failure:
[ERROR]  javafx.fxml.FXML,javafx.beans.DefaultProperty,com.sun.javafx.beans.IDProperty,com.google.common.annotations.Beta
[ERROR] /Users/jgawrilow/j/WM/sri/aic-praise/src/main/java/com/sri/ai/praise/core/inference/byinputrepresentation/interfacebased/core/exactbp/eager/core/AbstractExactBPNode.java:[215,1] error: method does not override or implement a method from a supertype
[ERROR] /Users/jgawrilow/j/WM/sri/aic-praise/src/main/java/com/sri/ai/praise/core/inference/byinputrepresentation/interfacebased/core/exactbp/eager/core/ExactBPNodeFromVariableToFactor.java:[55,7] error: ExactBPNodeFromVariableToFactor is not abstract and does not override abstract method makeNewEvaluator() in TreeComputation
[ERROR] /Users/jgawrilow/j/WM/sri/aic-praise/src/main/java/com/sri/ai/praise/core/inference/byinputrepresentation/interfacebased/core/exactbp/eager/core/ExactBPNodeFromFactorToVariable.java:[55,7] error: ExactBPNodeFromFactorToVariable is not abstract and does not override abstract method makeNewEvaluator() in TreeComputation
[ERROR] -> [Help 1]
[ERROR]
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR]
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoFailureException
```

I was able to correct the first error with:

```
--- a/src/main/java/com/sri/ai/praise/core/inference/byinputrepresentation/interfacebased/core/exactbp/eager/core/AbstractExactBPNode.java
+++ b/src/main/java/com/sri/ai/praise/core/inference/byinputrepresentation/interfacebased/core/exactbp/eager/core/AbstractExactBPNode.java
@@ -212,7 +212,6 @@ public abstract class AbstractExactBPNode<RootType,SubRootType> implements Exact
                return result;
        }

-       @Override
        public Factor function(List<Factor> incomingMessages) {
                Factor product = computeProductOfFactorsAtRootAndIncomingMessages(incomingMessages);
                List<? extends Variable> allFreeVariablesInProduct = product.getVariables();
```

however the 2nd two I believe require code that I can't seem to find.  Specifically, `import com.sri.ai.util.computation.treecomputation.anytime.core.AbstractAnytimeTreeComputation;`

Taking a step back and seeing what I can do with https://github.com/aic-sri-international/aic-expresso

```
git clone https://github.com/aic-sri-international/aic-expresso.git
mvn clean test
```

32 warnings and
```
[ERROR] COMPILATION ERROR :
[INFO] -------------------------------------------------------------
[ERROR] /Users/jgawrilow/j/WM/sri/aic-expresso/src/main/java/com/sri/ai/expresso/helper/Expressions.java:[797,61] error: incompatible types: no instance(s) of type variable(s) T exist so that List<? extends T> conforms to List<Expression>
[ERROR]
    T extends Object declared in class Wrapper
/Users/jgawrilow/j/WM/sri/aic-expresso/src/main/java/com/sri/ai/expresso/type/IntegerExpressoType.java:[76,26] error: IntegerIterator(int) has private access in IntegerIterator
[ERROR] /Users/jgawrilow/j/WM/sri/aic-expresso/src/main/java/com/sri/ai/grinder/library/set/extensional/ExtensionalSets.java:[130,32] error: incompatible types: no instance(s) of type variable(s) T exist so that List<? extends T> conforms to List<Expression>
[ERROR] /Users/jgawrilow/j/WM/sri/aic-expresso/src/main/java/com/sri/ai/grinder/tester/SGDPLLTTester.java:[437,73] error: incompatible types: no instance(s) of type variable(s) E exist so that LinkedHashSet<? extends E> conforms to Collection<Expression>
[ERROR]
    E extends Object declared in method <E>removeFromSetNonDestructively(Set<? extends E>,Predicate<E>)
/Users/jgawrilow/j/WM/sri/aic-expresso/src/main/java/com/sri/ai/grinder/tester/SGDPLLTTester.java:[735,80] error: incompatible types: no instance(s) of type variable(s) E exist so that LinkedHashSet<? extends E> conforms to Collection<Expression>
[ERROR] /Users/jgawrilow/j/WM/sri/aic-expresso/src/main/java/com/sri/ai/expresso/type/IntegerInterval.java:[137,8] error: IntegerIterator(int) has private access in IntegerIterator
[ERROR] /Users/jgawrilow/j/WM/sri/aic-expresso/src/main/java/com/sri/ai/expresso/type/IntegerInterval.java:[150,22] error: IntegerIterator(int) has private access in IntegerIterator
[ERROR] /Users/jgawrilow/j/WM/sri/aic-expresso/src/main/java/com/sri/ai/grinder/core/solver/AbstractSGVET.java:[232,60] error: incompatible types: no instance(s) of type variable(s) T exist so that LinkedList<? extends T> conforms to List<Expression>
[ERROR] /Users/jgawrilow/j/WM/sri/aic-expresso/src/main/java/com/sri/ai/grinder/library/number/Max.java:[92,33] error: incompatible types: no instance(s) of type variable(s) T exist so that LinkedList<? extends T> conforms to List<Expression>
[INFO] 9 errors
```
Actually, had to follow this first: https://github.com/aic-sri-international/aic-util/wiki/Getting-Started

So...
```
git clone https://github.com/aic-sri-international/aic-util.git 
cd aic-util
rm -r target; rm -r src
mvn clean install
# Success!

git clone https://github.com/aic-sri-international/aic-expresso.git
cd aic-expresso
rm -r target; rm -r src
mvn clean install
# Success!

git clone https://github.com/aic-sri-international/aic-praise.git
rm -r src
cd aic-priase.git
mvn clean install
# Success!
```

# Running:
TODO
