import type { RequestHandler } from '@sveltejs/kit';
import { BASE_BADGE, type ShieldsEndpointBadge } from '../../../../lib/helpers/shields';

export const GET: RequestHandler = async () => {
    const badgeInfo: Partial<ShieldsEndpointBadge> = {
        ...BASE_BADGE,
        label: `Install With`,
        message: `Mod Manager`,
    };

    return new Response(
        JSON.stringify(badgeInfo)
    );
};
