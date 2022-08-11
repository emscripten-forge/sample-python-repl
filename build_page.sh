#!/bin/bash
set -e

# install wasm env
rm -rf $MAMBA_ROOT_PREFIX/envs/pyjs-build-wasm
micromamba create -n pyjs-build-wasm \
    --platform=emscripten-32 \
    -c https://repo.mamba.pm/emscripten-forge \
    -c https://repo.mamba.pm/conda-forge \
    --yes \
    "pyjs>=0.8.0" numpy

# create build/work dir
mkdir -p build
cd build

# download empack config
EMPACK_CONFIG=empack_config.yaml
echo "donwload empack config"
wget -O $EMPACK_CONFIG https://raw.githubusercontent.com/emscripten-forge/recipes/main/empack_config.yaml


# pack the environment in a js/data file
empack pack env --env-prefix $MAMBA_ROOT_PREFIX/envs/pyjs-build-wasm --outname python_data --config empack_config.yaml


# copy relevant files from build to page
cp python_data.js   ../page  
cp python_data.data ../page

# copy relevant files from env to page
cp $MAMBA_ROOT_PREFIX/envs/pyjs-build-wasm/lib_js/pyjs/pyjs_runtime_browser* ../page

cd ../page

python -m http.server
