import { json, type RequestHandler } from '@sveltejs/kit';
import { BASE_BADGE, type ShieldsEndpointBadge } from '$lib/helpers/api/shields';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const badgeInfo: Partial<ShieldsEndpointBadge> = {
		...BASE_BADGE,
		label: `Install With`,
		message: `Mod Manager`,
	};

	return json(badgeInfo);
};
