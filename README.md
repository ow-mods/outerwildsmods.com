# [Outer Wilds Mods](https://outerwildsmods.com/)

Page for aggregating info related to mods for the game Outer Wilds. Built with [SvelteKit](https://kit.svelte.dev/).

The content of this website is generated at build time based on a few things:

- Basic information about the available mods and their thumbnails come from the [Outer Wilds Mod Database](https://github.com/ow-mods/ow-mod-db);
- The main content of each mod page (for example, [outerwildsmods.com/mods/nomaivr](https://outerwildsmods.com/mods/nomaivr/)) is taken from that mod's `README.md` (from the default branch);
- Images present in mod readmes are analyzed to retrieve their dimensions, so that the height/width can be included in the HTML and improve SEO;
- The download count history chart (for example, [outerwildsmods.com/mods/nomaivr/downloads](https://outerwildsmods.com/mods/nomaivr/downloads)) is taken from [this repo which goes through all the commit diffs in the mod database](https://github.com/misternebula/OWModDBDownloadCountExtractor).

## What to do if the website is down?

If you notice the website is down, please notify the admins in the [Outer Wilds Modding Discord](https://discord.gg/9vE5aHxcF9). In the meantime, you can use [this mirror hosted on Vercel](https://outerwildsmods-com.vercel.app/). If both of these are down, then God help us all.

## Development setup

- [Install Node](https://nodejs.org/en/download/);
- [Install pnpm](https://pnpm.io/installation);
- Run `pnpm install`;
- Run `pnpm run dev`;
- Server will run in localhost.

## Testing PRs

New PRs are automatically deployed to [a testing app on Vercel](https://outerwildsmods-com.vercel.app/). It's a good idea to test changes live, since some stuff might behave differently from the local environment.

## Deploying to production

Anything that's merged to master will be deployed to production with the [Auto Deploy workflow](https://github.com/ow-mods/outerwildsmods.com/actions/workflows/auto-deploy.yml).
