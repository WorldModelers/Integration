# DySE Framework Container

This directory builds a container which has DySE installed. 

First, you need to set your Bitbucket credentials in the `start.sh` file. Since the DySE Framework repository is private this is required. Make sure that the password you provide is URL encoded. You can do this with:

```
import urllib.parse
urllib.parse.quote_plus('YOUR_PASSWORD')
```

You are then ready to build the container and run examples with:

```
bash start.sh
```

The container will automatically run a Jupyter Notebook server on `port 8888`. You can access this by navigating to: [http://localhost:8888/notebooks/Site_Visit_Demo/a/b/c/API/DySE_tests.ipynb](http://localhost:8888/notebooks/Site_Visit_Demo/a/b/c/API/DySE_tests.ipynb)
