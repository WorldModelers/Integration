# Hume Processor & Annotation Tool

## Contents

1. [Hume Processor](#hume-processor)
2. [Hume Annotation Tool (HAT)](#hume-annotation-tool-(hat))
3. [HAT Usage](#hat-usage)
4. [Issues and Notes](#issues-and-notes)
5. [Server Configuration](#server-configuration)

## Hume Processor
Given an article in plain text, the dockerized `hume_pipeline` will return a CAG in JSON-LD format. Currently, the CAG will be printed out through stdout (terminal).

### Data preparation

Please download these two folders to your local machine (download the tgz files and unzip):

1. `docker_pipeline_wrapped_example`
2. `pipeline_docker`

### Build docker image
```
cd pipeline_docker
docker build --network=host .
```

> Note: if you don’t have permission to run this step, please add your Linux account into group “docker” by “sudo gpasswd -a [YOUR_LINUX_USERNAME_HERE] docker”. You may need to re-login to make it work.

At the bottom of the Docker build log, you will see something like this:

```
Step 35/36 : ENV PATH $SYSPATH
---> Using cache
---> 0cf53fcc9f7f
Step 36/36 : COPY wm_rootfs_final /wm_rootfs
---> a6f17e2c248c
Successfully built a6f17e2c248c
```

In which `a6f17e2c248c ` will be your `docker_image_id`. **Store this ID for later use**.

### Test Hume

Navigate to the `docker_pipeline_wrapped_example` directory.

Edit `entry_point.py`: change line 24 `docker_image_id` to the `docker_image_id` you generated from your Docker build. Next, change line 25 `scratch_space` to a temp folder, e.g., `/tmp/hume`. Warning: this will remove all content in this folder.

You’re all set for running experiments. Just run:

```
python3 entry_point.py
```

You can also change the variable named `doc_list` under `docker_pipeline_wrapped_example/entry_point.py` to a list of plain-text input articles.

### Results
Unable to complete test run of Hume. The error produced was:

```
wm_m12.ben_sentence.v1/list-serif-results wants 8192 MB, but the total limit is 7875 at /d4m/ears/releases/Cube2/R2016_07_21/install-optimize-x86_64/perl_lib/Scheduler/Job/Local.pm line 77.
cp: cannot stat '/wm_rootfs/git/CauseEx/experiments/causeex_pipeline/expts/wm_m12.ben_sentence.v1/serialization/analytic/wm_m12.ben_sentence.v1.json-ld': No such file or directory
```

## Hume Annotation Tool (HAT)
BBN has preprocessed two corpora and stored them in the backend database. A user (analyst/subject matter expert) can

1. reate new event types of interest, add then search for text mentions of the newly created event types
2. (work-in-progress) label whether an event argument (Location, Time, Actor) is correct with respect to the events
3. Export data to a format so that our Neural Network event model can train new event extraction models.


### Data preparation
Please download these three folders to your local machine:

1. `hat_docker`
2. `hat_expt`
3. `docker_hat_wrapped_example`

### Build docker image

```
cd hat_docker
docker build --network=host .
```

At the bottom of the log, you will see something like this:

```
Step 30/30 : ENV PATH $SYSPATH
 ---> Running in d21fc7dc5261
Removing intermediate container d21fc7dc5261
 ---> 7f25d102c590
Successfully built 7f25d102c590
```

in which ` 7f25d102c590` will be your `docker_image_id`. **Store this ID.**

### Run HAT
Navigate to the `docker_hat_wrapped_example` directory.

> Note: If you have your own MongoDB server set up at localhost, you may need to stop it for this to work.

Edit `entry_point.py`. please change the following parameters:

* `docker_image_id`: the `docker_image_id` mentioned above
* `hat_data_space`: where you have put `hat_expt`
* `annotation_data_export_path`: where you want the output of the exported annotation data to be stored. Warning: all folders and files under this path will be overwritten. 

Next, you must ingest the preprocessed corpus into MongoDB with:

```
python3 before_annotation.py
```

Now, you can run the web application with:

```
python3 do_annotation.py
```

You can try perform annotation by opening your browser and going to `http://127.0.0.1:5051`. You should replace "dummy" with `wm_m12_wm_intervention_4` as your session id, then go to step 3. Then you can start your annotation.

To stop the web application run:

```
python3 stop_annotation.py
```
To dump the annotations for futher training run:

```
python3 dump_annotation_data_out.py
```

You’ll see a folder defined at the `annotation_data_export_path` in `entry_point.py`; this is where the exported data will be stored.

### Results
Annotations were dumped to the `annotation_data_export_path` but the volume of annotations dumped is quite large. It is unclear whether this output was directly driven by annotations performed with HAT or whether it was from the preprocessed corpus.

## HAT Usage

Here is a video demonstrating how to use HAT for rapid event extraction customization: [https://vimeo.com/273014887](https://vimeo.com/273014887)

A few things to keep in mind:

1. When you do drag and drop operation, make sure the browser’s amination finishes before you release your mouse button. Otherwise you may drop the item into wrong place.
2. When use “Add new” for adding triggers, if you are searching for a noun phrase, please 1) use `_`  for spaces in between words, 2) use all lower case. For example, use `enter_the_race` for "enter the race".
3. When using “Add new” for adding triggers, if you are searching for a noun or a verb and can't find any results, please try its lemma, e.g., searching for "eat" for "ate". This rule doesn’t apply to noun phrases.
4. The left panel will turn green when you’re click on “Find similar”. If its background is grey, this panel can be used as a “working panel” for types you typed in.
5. When you click “Save”, all sentences left in the session will be saved as positive examples for the corresponding event type. 
6. When you click “Save”, you should expect to see a pop-up message box indicating that progress has been saved. Please do not close the browser before that pop-up appears (it should take seconds). Please save on a regular basis.
7. When the UI panel is initially loaded. (The first time you open the browser, or reload the page after “Save”). Sentence-level examples, annotated or not, won’t show up. You can always click “Show annotated examples” to retrieve saved previous work.

> Please feel free to send to us bug reports (screenshots will be super useful). 

## Issues and Notes

### Proprietary code/data

The `wm_rootfs_final` folder contains proprietary code and data which were developed under previous programs at BBN. Specifically:
`wm_rootfs_final/d4m/ears/releases/Cube2/R2016_07_21/install-optimize-x86_64` contains a tool called Runjobs. It is used extensively at BBN for scheduling jobs to a Sun grid computing environment.

The folder `wm_rootfs_final/git/jserif` contains Java-version of BBN’s SERIF NLP toolkit. 

`wm_rootfs_final/git/kbp`contains the BBN’s Knowledge Base Population (KBP) system written in Java. 

### Issues
If an open-source maven-based Java project depends on a close-source package, how should we distribute the close-source package?

### Create a new development corpus for HAT
We are working on this capability. We included pre-processed corpora with this preliminary release.

### Future pipeline
The interactions between HAT, Hume event model trainers, and the hume system pipeline. The process will look like the following:

1. Use HAT to create training data for events of interest
2. Use the Hume event model trainer to train new event extraction models
3. Using the new event models, run the Hume system pipeline over plain-text input and generate JSON-LD CAGs.
 
## Server Configuration

HAT is deployed to https://hume.worldmodelers.com. This was accomplished by running HAT [per instructions detailed above](#hume-annotation-tool-(hat)). However, before building the Docker containers, the backend API endpoint needed to be updated.

This value for the base endpoint for the backend API is currently hardcoded in `hat_docker/Hume_release/HAT/frontend/src/constants.js`. The value for `baseURL` was changed from `http://127.0.0.1:5050` to `https://hume.worldmodelers.com/api/`. 

Next, the containers were built per the above instructions. Since the frontend will now be making calls to `https://hume.worldmodelers.com/api/`, we can use NGINX to proxy any requests to `127.0.0.1:5050` and strip out the `/api` component of the path:

```
     location /api {
        rewrite /api/(.*) /$1  break;
        proxy_pass http://127.0.0.1:5050;
    }
```

The full NGINX configuration used on the server is [available here](https://github.com/WorldModelers/Integration/blob/master/Configurations/hume).
