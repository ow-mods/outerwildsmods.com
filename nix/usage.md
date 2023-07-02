This is a flake to make developing the website easier in systems using nix.

To use it you can either run
```shell
nix develop github:ow-mods/outerwildsmods.com.git?dir=nix
```
if you just want to test it in your system without needing to clone the repo, or
```shell
nix develop ./nix
```
if you have cloned it and is on the root folder of the repository.

This flake will create a shell with all the needed tools to run the website, and will automatically run `pnpm run dev` on start.
