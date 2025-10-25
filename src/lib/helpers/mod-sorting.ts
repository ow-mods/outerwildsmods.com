import type { Mod } from './api/get-mod-list';
import { recentViewsDayCount } from './constants';

export const sortOrderParamName = 'sortOrder' as const;

export const sortOrders = {
	installs: {
		title: 'Popular',
		compareFunction: (modA: Mod, modB: Mod) => {
			return modB.installCount - modA.installCount;
		},
	},
	popularNew: {
		title: 'Popular New',
		compareFunction: (modA: Mod, modB: Mod) => {
			let now = new Date();
			function popularNewScore(mod: Mod) {
				// A mod needs 2x the views to be hotter than a mod that is half its age
				// Mods over a year old are ranked by installs
				var age = (now.valueOf() - new Date(mod.firstReleaseDate).valueOf()) / (1000 * 60 * 60 * 24);
				var score = age < 365 ? mod.installCount / Math.max(age, 7) : mod.installCount + Number.MIN_SAFE_INTEGER;
				return score;
			}

			return popularNewScore(modB) - popularNewScore(modA);
		},
	},
	mostDownloaded: {
		title: 'Most downloaded',
		compareFunction: (modA: Mod, modB: Mod) => modB.downloadCount - modA.downloadCount,
	},
	leastDownloaded: {
		title: 'Least downloaded',
		compareFunction: (modA: Mod, modB: Mod) => modA.downloadCount - modB.downloadCount,
	},
	mostViewsXDays: {
		title: `Recent views (${recentViewsDayCount} days)`,
		compareFunction: (modA: Mod, modB: Mod) => {
			return modB.viewCount - modA.viewCount;
		},
	},
	newest: {
		title: 'Newest',
		compareFunction: (modA: Mod, modB: Mod) =>
			new Date(modB.firstReleaseDate).valueOf() - new Date(modA.firstReleaseDate).valueOf(),
	},
	oldest: {
		title: 'Oldest',
		compareFunction: (modA: Mod, modB: Mod) =>
			new Date(modA.firstReleaseDate).valueOf() - new Date(modB.firstReleaseDate).valueOf(),
	},
	updated: {
		title: 'New updates',
		compareFunction: (modA: Mod, modB: Mod) =>
			new Date(modB.latestReleaseDate).valueOf() - new Date(modA.latestReleaseDate).valueOf(),
	},
} as const;

export type SortOrderId = keyof typeof sortOrders;

export const isSortOrderId = (key: string): key is SortOrderId => {
	return Object.keys(sortOrders).includes(key);
};

export const sortModList = (
	modList: Mod[],
	sortOrder: SortOrderId,
	count = 0,
	excludeMods: Mod[] = []
) => {
	const sortedList = modList
		.sort(sortOrders[sortOrder].compareFunction)
		.filter((mod) => !excludeMods.find((excludedMod) => mod.uniqueName == excludedMod.uniqueName));
	if (count > 0) {
		return sortedList.slice(0, count);
	} else {
		return sortedList;
	}
};
