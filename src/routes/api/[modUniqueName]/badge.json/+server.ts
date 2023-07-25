import { error, type RequestHandler } from '@sveltejs/kit';
import type { Mod } from '$lib/helpers/api/get-mod-list';
import { BASE_BADGE, type ShieldsEndpointBadge } from '../../../../lib/helpers/shields';

type Params = {
    modUniqueName: string;
};

export const GET: RequestHandler<Params> = async ({ params, fetch }) => {
    const { modUniqueName } = params;

    const modList = (await (await fetch('/api/mods.json')).json()) as Mod[];

    const mod = modList.find(({ uniqueName }) => uniqueName === modUniqueName);

    if (!mod) {
        throw error(500, `Failed to find mod ${modUniqueName}`);
    }

    const badgeInfo: Partial<ShieldsEndpointBadge> = {
        ...BASE_BADGE,
        label: `Install ${mod.name} With Mod Manager`,
        message: `${mod.installCount}`,
    };

    return new Response(
        JSON.stringify(badgeInfo)
    );
};