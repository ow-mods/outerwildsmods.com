{

  inputs = {
    nixpkgs = { # for utility functions like mkShell
      url = "github:NixOS/nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        packages.nodejs = pkgs.nodejs;

        devShell =
          pkgs.mkShell {
            buildInputs =
            [
              pkgs.nodejs
            ];
            shellHook = ''
              npm run dev
            '';
          };
    });
}
