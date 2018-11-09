# BBN Components

* Analysis Date: 11/5/2018


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
https://github.com/BBN-E/Hume is the open source repo they're using for Hume however it's not ready to go.  They are providing us SFTP access to download a package for install.

From Haoling,

```
As you may know, LearnIt is a tool which extracts causal relation between events, detected by another Hume component.

Here is an example from the WM month 6 evaluation document set:

 

  "Furthermore , the education <SLOT0>crisis</SLOT0> increases the <SLOT1>risk</SLOT1> that more out-of-school adolescents will be recruited by armed actors ."

Assuming that two events, "crisis" and "risk", are already detected (and present in SERIF XML files as input to LearnIt). Here LearnIt detected there is a "Catalyst-Effect" relation between "crisis" and "risk", and output a relation in a causal json file

The input to LearnIt relation decoder (as demonstrated here) is a set of serifxmls with events tagged by a system, which we plan to share with you in the following weeks. For this release, we included the SERIF XML files for the WM 52 documents.

We attached a gzipped file as an attachment. A quickstart manual includes technical details, and how to compile and run Learnit on a preprocessed document sets. The manual is in the name `learnit_release/learnit_release1.md` in the zip file. Feel free to ask any questions.

About the "maven" repo. In our attachment there's a maven repo folder which contains jars from BBN's internal maven repo. There are software dependencies that are developed under previous programs (they are available to the government via govn't property rights, but not open-sourced), and we do not plan to open source some of the dependencies. You may find the instruction to run `maven install` is a bit tricky. Do you have a better idea about how to do this?
```

To get the package, connect to SFTP server.  Once connected do:
```
get learnit_release_v1.tar.gz
get lemma.nv
```

To prepare install:

```
# Basically upack everythin
mkdir bbn
mv learnit_release_v1.tar.gz lemma.nv bbn
cd bbn
tar -zxf learnit_release_v1.tar.gz
tar -zxf learnit_release_m2.tar.gz
```

# General Findings

## Documentation

Instructions can generally be followed at `learnit_release/learnit_release1.md`.  Above (the unpacking) and below (the install and run) is a cleaned up version of that.

Inputs are the files at `serifxmls`.

Outputs are ultimately `causal_json.json`

# Installation:

Basically it starts with swapping out your own maven repo for theirs (not good for an actual install) so be cautious of this.  It's because some of the JARs aren't public and/or they haven't fully developed out the process to go get all the dependencies.  We need to understand what this process should look like moving forward.
```
mv ~/.m2 .~/m2-back
cp learnit_release_m2.tar.gz ~
tar -C ~ -zxf ~/learnit_release_m2.tar.gz
rm ~/learnit_release_m2.tar.gz
```

Learnit in Hume is for extracting causal relations from extracted events. The data pipeline now is
```
            Use permutations to generate all posible pairs
SerifXMLs ------------------------------------------------> Mappings 
           filtered based on causal patterns 
Mappings --------------------------------------> CausalJson
```
The entry point for generating mappings part lies at `[LEARNIT_ROOT]/neolearnit/src/main/java/com/bbn/akbc/neolearnit/exec/InstanceExtractor.java`. 

The entry point for generating causal json lies at `[LEARNIT_ROOT]/neolearnit/src/main/java/com/bbn/akbc/neolearnit/utils/EventEventRelationPatternDecoder.java`

The path to the `lemma.nv` file is hardcoded in `learnit_release/neolearnit/src/main/java/com/bbn/akbc/neolearnit/util/GeneralUtils.java` at line 280 to `/nfs/raid87/u14/WM/resources/lemma.nv`.

You can either 1) change this source to point to your `bbn/lemma.nv` file or create a symbolic to this location which matches what's in the file.  Let's update the source before compiling.

```
LMPATH=`pwd`
sed -i '' "280s#/nfs/raid87/u14/WM/resources#$LMPATH#" learnit_release/neolearnit/src/main/java/com/bbn/akbc/neolearnit/util/GeneralUtils.java
```

Now to compile and install...

```
cd learnit_release
mvn install -o
cd ../
```
On my system output looks like:

```
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 50.780 s
[INFO] Finished at: 2018-11-04T11:53:13-05:00
[INFO] Final Memory: 240M/1414M
```

Now we need to change some configuration files around.  Specifically some that point to the locations of the input files.  We move the old config and create a new one with our own locations.

```
# Move old
mv learnit_release_exp/source_lists/nn_events_serifxml.list learnit_release_exp/source_lists/nn_events_serifxml.list.old
# Create our own
find `pwd`/serifxmls/* > learnit_release_exp/source_lists/nn_events_serifxml.list
```

More configuration file changes.  Looks like learnit and source_list path stuff.

```
# Copy over old
cp learnit_release_exp/empty.params learnit_release_exp/empty.params.old
# Change paths to our own.
sed -i '' "s#/home/hqiu/massive#`pwd`#g" learnit_release_exp/empty.params
```

# Running:

* This generates mappings.
```
learnit_release/neolearnit/target/appassembler/bin/InstanceExtractor learnit_release_exp/empty.params all_event_event_pairs learnit_release_exp/source_lists/nn_events_serifxml.list learnit_release_exp/output.sjson
```

You should see output like:

```
Processing /Users/jgawrilow/j/WM/bbn/test/serifxmls/ENG_NW_19860901.serifxml...
Processing /Users/jgawrilow/j/WM/bbn/test/serifxmls/ENG_NW_20080101.serifxml...
Processing /Users/jgawrilow/j/WM/bbn/test/serifxmls/ENG_NW_20110711.serifxml...
Processing /Users/jgawrilow/j/WM/bbn/test/serifxmls/ENG_NW_20120402.serifxml...
```
* This creates the causal json

```
learnit_release/neolearnit/target/appassembler/bin/EventEventRelationPatternDecoder learnit_release_exp/empty.params learnit_release_exp/output.sjson learnit_release_exp/causal_json.json all 0 na na learnit_release_exp/extractors
```

You should see output like:

```
targetPath: /Precondition-Effect
targetPath: /Before-After
targetPath: /Cause-Effect
targetPath: /Preventative-Effect
targetPath: /MitigatingFactor-Effect
targetPath: /Catalyst-Effect
=== Loading word-lemma map...
===     done loading word-lemma map.
=== Process json file: learnit_release_exp/output.sjson
=== Number of patterns in mappings: 9390
=== Found a hit with lemmatized pattern for: {0} causing {1}     lemmatizedPattern: {0} cause {1}
=== Found a hit with lemmatized pattern for: {1} results from {0}    lemmatizedPattern: {1} result from {0}
=== Found a hit with lemmatized pattern for: {0} caused {1}  lemmatizedPattern: {0} cause {1}
=== Found a hit with lemmatized pattern for: {0} reduced {1}     lemmatizedPattern: {0} reduce {1}
=== Number of patterns decoded from mappings: 122
== try loading serifxml for ENG_NW_20151201
# lines read: 1
# lines read: 1
# lines read: 1
docid:  ENG_NW_20151201 path:   /Users/jgawrilow/j/WM/bbn/test/serifxmls/ENG_NW_20151201.serifxml
== try loading serifxml for ENG_NW_20150211
docid:  ENG_NW_20150211 path:   /Users/jgawrilow/j/WM/bbn/test/serifxmls/ENG_NW_20150211.serifxml
== try loading serifxml for ENG_NW_20160301
docid:  ENG_NW_20160301 path:   /Users/jgawrilow/j/WM/bbn/test/serifxmls/ENG_NW_20160301.serifxml
....
....
....
Cause-Effect    ENG_NW_20161201 14058   14065   14050   14056   Many families report having had to abandon young children , aged and infirm family members when <SLOT1>fleeing</SLOT1> <SLOT0>fighting</SLOT0> .    fighting    fleeing verb:fleeing[<obj> = 0] |
Cause-Effect    ENG_NW_20120411 9980    9989    10039   10048   It is most likely that <SLOT0>investment</SLOT0> in the agricultural sector will create enormous <SLOT1>employment</SLOT1> opportunities that will enable people to have income for self-reliance . investment  employment  {0} will create {1} |
Before-After    ENG_NW_20170106 32380   32390   32287   32296   For ﬁsheries , however , the compounding <SLOT1>complexity</SLOT1> of how the entire marine food chain will be altered leads to perhaps even greater <SLOT0>uncertainty</SLOT0> .   uncertainty complexity  verb:leads[<sub> = 1][to = 0] |
```

Finally, you can see the results at `learnit_release_exp/causal_json.json`

