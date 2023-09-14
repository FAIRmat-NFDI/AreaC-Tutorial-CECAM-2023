# Area C - Tutorial for CECAM flagship workshop "Fair and True Data Processing for Soft Matter Simulations"

### How to launch locally for debugging

In the workflow-documentation directory, create your own virtual environment with Python3.9:
```
python3 -m venv .pyenvtuto
```
and activate it in your shell:
```
. .pyenvdoc/bin/activate
```
Always ensure that the environment is active.
Else run the command above again.

Install the right dependencies:
```
pip install -r requirements.txt
```

Launch locally:
```
mkdocs serve
```

The output on the terminal should have these lines:
```
...
INFO     -  Building documentation...
INFO     -  Cleaning site directory
INFO     -  Documentation built in 0.29 seconds
INFO     -  [14:31:29] Watching paths for changes: 'docs', 'mkdocs.yml'
INFO     -  [14:31:29] Serving on http://127.0.0.1:8000/
...
```
Then click on the http address to launch the MKDocs.
