# [Outer Wilds Mods](https://outerwildsmods.com/)

Simple page for aggregating info related to mods for the game Outer Wilds. Built with [SvelteKit](https://kit.svelte.dev/).

The mod pages in this website are automatically generated from the [Outer Wilds Mod Database](https://github.com/Raicuparta/ow-mod-db). The main content of each mod page (for example, [outerwildsmods.com/mods/nomaivr](https://outerwildsmods.com/mods/nomaivr/)) is taken from that mod's `README.md` (from the default branch).

## Development setup

* [Install Node](https://nodejs.org/en/download/);
* [Install pnpm](https://pnpm.io/installation);
* Run `pnpm run install`;
* Run `pnpm run dev`;
* Server will run in localhost.

## Testing PRs

New PRs are automatically deployed to [a testing app on Vercel](https://outerwildsmods-com.vercel.app/). It's a good idea to test changes live, since some stuff might behave differently from the local environment.

## Deploying to production

Anything that's merged to master will be deployed to production with the [Auto Deploy workflow](https://github.com/Raicuparta/outerwildsmods.com/actions/workflows/auto-deploy.yml).
