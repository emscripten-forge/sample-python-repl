# sample-python-repl

A demo repository for create a Python REPL that runs in the browser.

## Requirements

You will need to install [micromamba](https://mamba.readthedocs.io/en/latest/installation.html#micromamba) to build the application.

## Usage

First clone the repository:

```bash
git clone https://github.com/emscripten-forge/sample-python-repl
cd sample-python-repl
```

Then create a new environment that will be used for building the REPL:

```bash
# create the environment
micromamba create -n pyjs-build-env -f build-environment.yaml -y
# activate the environment
micromamba activate pyjs-build-env
```

In the environment, run the build script:

```bash
python build.py
```

This create a new environment that will include the dependencies for running the REPL in the browser (runtime).
The script also copies the relevant files to the `build` folder.

You can then start an HTTP server to serve the files in the `build` folder:

```bash
python -m http.server --directory build
```

And open the REPL in your browser at http://localhost:8000.
