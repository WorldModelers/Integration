# Kimetrica Modeling Report
To run Kimetrica's models, you must build the Kiluigi Scheduler container. Once the scheduler is built, you are dropped into the container's CLI. From there, you can execute models from the `models` directory. Note that the `darpa` Github repository is mounted at `/usr/src/app` so the `models` are available ` /usr/src/app/models`. 

## Building the Scheduler
The following will build the scheduler and run it, dropping you into the container with `bash`:

```
git clone --recursive https://gitlab.kimetrica.com/DARPA/darpa.git
cd darpa/kiluigi
git checkout master
cd ..

sed -i '4s/kiluigi\///g' env.example
cp env.example kiluigi/.env
cp luigi.cfg.example luigi.cfg
cd kiluigi
docker-compose run --entrypoint=bash scheduler

```

## Running Models
To run a model (from the scheduler container) you should use something like:

```
luigi --module models.malnutrition_model.tasks models.malnutrition_model.tasks.RasterToCSV --local-scheduler
```

Note that the first argument after `--module` is the `.` path of the module's tasks file (without `.py`). The second argument is the actual tasks (from `tasks.py` to execute). Generally, the last task should be selected as it writes the models output.

Output will be written to `/usr/src/app/output` (within the container) or at `darpa/output` on localhost.

## Compute Requirements
Running Kimetrica's [malnutrition model](https://gitlab.kimetrica.com/DARPA/darpa/tree/master/models/malnutrition_model) failed on a [AWS t3.large](https://aws.amazon.com/ec2/instance-types/t3/) instance (8gb of memory) due to memory issues. However, it ran successfully on a [t3.xlarge](https://aws.amazon.com/ec2/instance-types/t3/) instance (32gb of memory). 