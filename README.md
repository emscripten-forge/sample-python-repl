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

Now create a new environment that will include the dependencies for running the REPL in the browser:

```bash
micromamba create -n pyjs-web-env --platform=emscripten-32 -f web-environment.yaml -y
```

Create a new build directory and configure the build:

```bash
mkdir build
cd build
```

Pack the environment:

```bash
empack pack env --env-prefix $MAMBA_ROOT_PREFIX/envs/pyjs-web-env
```

This will generate a list of `.tar.gz` files in the `build` directory.

Now copy the HTML and JavaScript files from the `page` directory to the `build` directory:

```bash
cp ../page/* .
```

You will also need to copy the browser runtime from the `pyjs-web-env` environment to the `build` directory:

```bash
cp $MAMBA_ROOT_PREFIX/envs/pyjs-web-env/lib_js/pyjs/pyjs_runtime_browser.js .
```

Finally open the `build/index.html` file in your browser.
