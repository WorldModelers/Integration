# KiLuigi Installation Report

## Overview
KiLuigi is a workflow management system created by Kimetrica for managing modeling tasks in a distributed, asynchronous manner. The repository can be found at [https://gitlab.kimetrica.com/DARPA/darpa.git](https://gitlab.kimetrica.com/DARPA/darpa.git). This repository contains **Valve**, a Django front-end for KiLuigi.


## Setup
The KiLuigi repository was cloned and set up using:

```
git clone https://gitlab.kimetrica.com/DARPA/darpa.git
cd darpa
git checkout ef3689b5c
git submodule update --init --recursive
cp env.example .env
```

Next, the Docker containers were run with:

```
docker-compose -f kiluigi/docker-compose.yml -f kiluigi/docker-compose.override.yml up db
docker-compose -f kiluigi/docker-compose.yml -f kiluigi/docker-compose.override.yml up db
```

> Note: the first `docker-compose` command may have failed as the database migration did not take place as expected.


## Luigi Set-up
A Luigi worker nor the Luigi scheduler were set up by `docker-compose` and the configuration needed to be updated. First change `luigi.cfg`:

```
default-scheduler-url=http://scheduler:8082/
```

should be changed to:

```
default-scheduler-url=http://localhost:8082/
```

Next, run:

```
mkdir /etc/luigi
cd /usr/src/app/kiluigi
cp luigi.cfg /etc/luigi/
cd kiluigi
./manage.py migrate
```

From here, you can create the Valve superuser with:

```
python manage.py createsuperuser
```

Now, you should turn on the Luigi scheduler and run a worker with:

```
luigid --pidfile /usr/src/app/run/luigi.pid $* &
luigi Task --assistant $* &
```
 
## Valve Webapplication
The Valve application was available at `localhost:8000`. After logging in using the superuser credentials, tasks can be submitted at: `http://localhost:8000/register/`.

However, each submitted task resulted in an error:

```
django.utils.datastructures.MultiValueDictKeyError: 'name'
```

This is because line 97 of `kiluigi/valve/viewsets.py` expects that the Django `request` object has a data field called name. This is defined by the  `task_name` parameter in the javascript within `registered_task_detail.html`. The javascript selector for `task_name` returns null, so Django errors. This can be resolved by updating the selector which defines `task_name` to:

```
const task_name = document.querySelector('div.main-container').querySelector('h1').textContent
```

However, `viewsets.py` still returns an error due to its attempt to return a `Response` object containing an `AsyncResult`:

```
return Response(result)
```

This should be updated to return something else, such as the `AsyncResult`'s ID:

```
return Response(result.id)
```

## Submitting KiLuigi Tasks

Example or test tasks could be successfuly submitted to KiLuigi with the following Python script:

```
import random
from valve.tasks import submit_luigi_task
from valve.models import Task
from tests.integration.core import wait_for_results

result = submit_luigi_task.run('tests.integration.linear.tasks.Dest2', mid_num=1, src_num=1, workers=1)
```

However, testing with a real task from `tasks.darpa_geospatial_tasks` failed. Trying:

```
result = submit_luigi_task.run('tasks.darpa_geospatial_tasks.tests.test_geospatial_tasks.test_raster_proj', workers=1)
```

Resulted in errors associated with the `import luigi_wrappers.py` on line 10 of `tasks/darpa_geospatial_tasks/tests/test_geospatial_tasks.py`. Trying to submit tasks directly from `tasks/darpa_geospatial_tasks/luigi_wrappers.py` also failed due to missing the file `ckan_import.py`.