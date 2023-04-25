# sample-python-repl

A demo repository for create a Python REPL that runs in the browser.

![a screenshot showing the Pyhon REPL in the browser](https://user-images.githubusercontent.com/591645/234264366-1bf9331e-da99-452f-9e66-69c5fcf7f34b.png)

## Try it in your browser

You can try the Python REPL in your browser at the following URL: https://emscripten-forge.github.io/sample-python-repl

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
