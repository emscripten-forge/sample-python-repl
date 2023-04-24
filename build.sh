#!/bin/bash
set -e

# install wasm env
micromamba create -n pyjs-web-env \
    --platform=emscripten-32 \
    --yes \
    -f web-env.yaml

# create build/work dir
mkdir -p build
cd build

# download empack config
EMPACK_CONFIG=empack_config.yaml
echo "download the empack config"
wget -O $EMPACK_CONFIG https://raw.githubusercontent.com/emscripten-forge/recipes/main/empack_config.yaml

# pack the environment in a js/data file
empack pack env --env-prefix $MAMBA_ROOT_PREFIX/envs/pyjs-web-env --outname python_data --config empack_config.yaml

# copy relevant files from build to page
cp python_data.js   ../page
cp python_data.data ../page

# copy relevant files from env to page
cp $MAMBA_ROOT_PREFIX/envs/pyjs-web-env/lib_js/pyjs/pyjs_runtime_browser* ../page

cd ../page

python -m http.server
