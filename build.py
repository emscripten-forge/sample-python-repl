import argparse
import os
import shutil
import subprocess

from pathlib import Path


def create_env(env_name):
    subprocess.run(
        [
            "micromamba",
            "create",
            "-n",
            env_name,
            "--platform=emscripten-32",
            "--yes",
            "-f",
            "web-environment.yaml",
        ],
        check=True,
    )


def pack_env(env_prefix, output_dir):
    subprocess.run(
        [
            "empack",
            "pack",
            "env",
            "--env-prefix",
            str(env_prefix),
            "--relocate-prefix",
            "/",
            "--no-use-cache",
            "--outdir",
            output_dir,
        ],
        check=True,
    )


def copy_files(src_dir, dst_dir):
    for path in src_dir.glob("*"):
        shutil.copy(str(path), str(dst_dir))


def main(env_name):
    create_env(env_name)

    # create build/work dir
    build_dir = Path("build")
    build_dir.mkdir(exist_ok=True)

    # pack the environment in a js/data file
    env_prefix = Path(
        os.environ.get("MAMBA_ROOT_PREFIX", f"/opt/conda/envs/{env_name}")
    )
    pack_env(env_prefix / "envs" / env_name, output_dir=str(build_dir))

    # copy relevant files
    page_dir = Path("page")
    copy_files(page_dir, build_dir)

    # copy relevant files from env to page
    lib_js_dir = env_prefix / "envs" / env_name / "lib_js" / "pyjs"
    copy_files(lib_js_dir, build_dir)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Install wasm env and copy relevant files."
    )
    parser.add_argument(
        "--env-name",
        metavar="ENV_NAME",
        type=str,
        required=True,
        help="name of the mamba environment",
    )
    args = parser.parse_args()
    main(args.env_name)
