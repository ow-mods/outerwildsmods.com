This is a flake to make developing the website easier in systems using nix.

To use it you can run
```shell
nix develop ./nix
```
if you are on the root folder of the repository.

This flake will create a shell with all the needed tools to run the website, and will automatically run `pnpm run dev` on start.
