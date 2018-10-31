# Pitt Writeup

* Analysis Date: 10/26/2018 - 10/31/2018
* Software Branch: develop
* URL: [https://bitbucket.org/biodesignlab/framework/src/develop/](https://bitbucket.org/biodesignlab/framework/src/develop/)

Justin tested with:

* System: MacOS 10.13.6

# Contents
* [General Findings](#general-findings)
* [Documentation](##documentation)
* [Installation](##installation)
* [Issues](#issues)

# General Findings

The framework code is huge! 933 MB which seems a lot for code.  Perhaps models and/or data is included.

## Documentation
Documentation is a little scattered but most of the pieces are there somehow or another.  Looking at https://bitbucket.org/biodesignlab/framework/src/develop/ for installation.  Usage seems to be everything under the examples directory including the .ipynb and test-\*.bash run scripts.

The big gap is what this actually does in human speak. How would I use this with my own data?

## Requirements

* [GSL](https://www.gnu.org/software/gsl/)
* [mcl](https://micans.org/mcl/)
* certainly `make`

## Installation

For MAC

```
# Get the code
# 933 MB
git clone https://jgawrilo@bitbucket.org/biodesignlab/framework.git

# MCL https://micans.org/mcl/
wget https://micans.org/mcl/src/mcl-latest.tar.gz
tar xzf mcl-latest.tar.gz
cd mcl-14-137/
./configure --prefix=$HOME/local
make install
cd ../
rm mcl-latest.tar.gz

# GSL install https://www.gnu.org/software/gsl/
brew install gsl

# Create and source env
conda create -n pitt_env python=3.7.0 pip -y
source activate pitt_env
pip install --upgrade pip
pip install jupyter
pip install plotly 
pip install xlrd
pip install seaborn

export FRAMEWORKPATH=`pwd`/framework

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

# Install cytoscape and run it
# https://cytoscape.org/download.html


### RUN
jupyter notebook

# Navigate to ./examples/examples.ipynb and run the notebook (may want to look at the issue below before to ensure a successful run.)

At the end, you should see something like the following in Cytoscape:

![graph](https://github.com/WorldModelers/Integration/raw/master/Reports/graph.png)
```
# Issues
Within the examples.ipynb, at the cell:

```
# run genetic algorithm to cluster extensions
# model extension will save/return any models that satisfy defined properties
# only running one generation and small population to limit time
initialize_ga_structure(
    baseline_model_file, clusters, output_folder,
    test_file, property_file, estimate_threshold,
    framework_path,
    n_generations=1, init_pop_size=3, ind_size=3,
    mu_individuals=3, lambda_num_children=3,
    steps=100)
```

I get the following error:

```
---------------------------------------------------------------------------
_RemoteTraceback                          Traceback (most recent call last)
_RemoteTraceback: 
'''
Traceback (most recent call last):
  File "/Users/jgawrilow/anaconda3/envs/pitt_env/lib/python3.7/site-packages/joblib-0.12.5-py3.7.egg/joblib/externals/loky/process_executor.py", line 393, in _process_worker
    call_item = call_queue.get(block=True, timeout=timeout)
  File "/Users/jgawrilow/anaconda3/envs/pitt_env/lib/python3.7/multiprocessing/queues.py", line 113, in get
    return _ForkingPickler.loads(res)
AttributeError: Can't get attribute 'Individual' on <module 'deap.creator' from '/Users/jgawrilow/anaconda3/envs/pitt_env/lib/python3.7/site-packages/deap-1.2.2-py3.7-macosx-10.7-x86_64.egg/deap/creator.py'>
'''

The above exception was the direct cause of the following exception:

BrokenProcessPool                         Traceback (most recent call last)
<ipython-input-23-613e4df09c28> in <module>
      8     n_generations=1, init_pop_size=3, ind_size=3,
      9     mu_individuals=3, lambda_num_children=3,
---> 10     steps=100)

~/anaconda3/envs/pitt_env/lib/python3.7/site-packages/dyse-0.1-py3.7.egg/Extension/geneticAlgorithm.py in initialize_ga_structure(init_model, extensions, output_path, test_, property_, estimate_threshold, framework_path, scenario, normalize, init_pop_size, ind_size, mu_individuals, lambda_num_children, p_crossover, p_mutation, n_generations, steps)
    237     pop, log = MyeaMuCommaLambda(pop, toolbox, mu=mu_individuals, lambda_=lambda_num_children, 
    238         cxpb=p_crossover, mutpb=p_mutation, ngen=n_generations,
--> 239         stats=stats, halloffame=hof, verbose=True)
    240 
    241     logging.info(('%s') % str(log))

~/anaconda3/envs/pitt_env/lib/python3.7/site-packages/dyse-0.1-py3.7.egg/Extension/geneticAlgorithm.py in MyeaMuCommaLambda(population, toolbox, mu, lambda_, cxpb, mutpb, ngen, stats, halloffame, verbose)
    113     invalid_ind = [ind for ind in population if not ind.fitness.valid]
    114     invalid_ind_to_fitness = [[idx,ind] for idx,ind in enumerate(population) if not ind.fitness.valid]
--> 115     fitnesses = toolbox.map(toolbox.evaluate, invalid_ind_to_fitness)
    116     for ind, fit in zip(invalid_ind, fitnesses):
    117         ind.fitness.values = fit

~/anaconda3/envs/pitt_env/lib/python3.7/site-packages/dyse-0.1-py3.7.egg/Extension/geneticAlgorithm.py in mymap(f, *iters)
     36 
     37 def mymap(f, *iters):
---> 38     return Parallel(n_jobs=-1)(delayed(f)(*args) for args in zip(*iters))
     39 
     40 # To read the initial model

~/anaconda3/envs/pitt_env/lib/python3.7/site-packages/joblib-0.12.5-py3.7.egg/joblib/parallel.py in __call__(self, iterable)
    994 
    995             with self._backend.retrieval_context():
--> 996                 self.retrieve()
    997             # Make sure that we get a last message telling us we are done
    998             elapsed_time = time.time() - self._start_time

~/anaconda3/envs/pitt_env/lib/python3.7/site-packages/joblib-0.12.5-py3.7.egg/joblib/parallel.py in retrieve(self)
    897             try:
    898                 if getattr(self._backend, 'supports_timeout', False):
--> 899                     self._output.extend(job.get(timeout=self.timeout))
    900                 else:
    901                     self._output.extend(job.get())

~/anaconda3/envs/pitt_env/lib/python3.7/site-packages/joblib-0.12.5-py3.7.egg/joblib/_parallel_backends.py in wrap_future_result(future, timeout)
    515         AsyncResults.get from multiprocessing."""
    516         try:
--> 517             return future.result(timeout=timeout)
    518         except LokyTimeoutError:
    519             raise TimeoutError()

~/anaconda3/envs/pitt_env/lib/python3.7/concurrent/futures/_base.py in result(self, timeout)
    430                 raise CancelledError()
    431             elif self._state == FINISHED:
--> 432                 return self.__get_result()
    433             else:
    434                 raise TimeoutError()

~/anaconda3/envs/pitt_env/lib/python3.7/concurrent/futures/_base.py in __get_result(self)
    382     def __get_result(self):
    383         if self._exception:
--> 384             raise self._exception
    385         else:
    386             return self._result

BrokenProcessPool: A task has failed to un-serialize. Please ensure that the arguments of the function are all picklable.
```

This can be resolved by editing framework/Extension/geneticAlgorithm.py (comment out line 193) but I believe this removes the parallelization.
`#toolbox.register("map", mymap) # For Parallelization`

Keep in mind you'll have to do a `python setup.py install` again.

I'm not sure if it's an input issue or a parallel processing issue.  We should follow up with Pitt on this.