import type { ModFromDatabase } from './api/get-mod-database';
import { recentViewsDayCount } from './constants';

export const sortOrderParamName = 'sortOrder' as const;

export const sortOrders = {
	hot: {
		title: 'Hot',
		compareFunction: (modA: ModFromDatabase, modB: ModFromDatabase) => {
			return modB.installCount - modA.installCount;
		},
	},
	mostDownloaded: {
		title: 'Most downloaded',
		compareFunction: (modA: ModFromDatabase, modB: ModFromDatabase) =>
			modB.downloadCount - modA.downloadCount,
	},
	leastDownloaded: {
		title: 'Least downloaded',
		compareFunction: (modA: ModFromDatabase, modB: ModFromDatabase) =>
			modA.downloadCount - modB.downloadCount,
	},
	mostViewsXDays: {
		title: `Recent views (${recentViewsDayCount} days)`,
		compareFunction: (modA: ModFromDatabase, modB: ModFromDatabase) => {
			return modB.viewCount - modA.viewCount;
		},
	},
	newest: {
		title: 'Newest',
		compareFunction: (modA: ModFromDatabase, modB: ModFromDatabase) =>
			new Date(modB.firstReleaseDate).valueOf() - new Date(modA.firstReleaseDate).valueOf(),
	},
	oldest: {
		title: 'Oldest',
		compareFunction: (modA: ModFromDatabase, modB: ModFromDatabase) =>
			new Date(modA.firstReleaseDate).valueOf() - new Date(modB.firstReleaseDate).valueOf(),
	},
	updated: {
		title: 'New updates',
		compareFunction: (modA: ModFromDatabase, modB: ModFromDatabase) =>
			new Date(modB.latestReleaseDate).valueOf() - new Date(modA.latestReleaseDate).valueOf(),
	},
} as const;

export type SortOrderId = keyof typeof sortOrders;

export const isSortOrderId = (key: string): key is SortOrderId => {
	return Object.keys(sortOrders).includes(key);
};

export const sortModList = (
	modList: ModFromDatabase[],
	sortOrder: SortOrderId,
	count = 0,
	excludeMods: ModFromDatabase[] = []
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
