import type { ModsRequestItem } from '../../routes/api/mods/+server';
import { recentViewsDayCount } from './constants';

export const sortOrderParamName = 'sortOrder' as const;

export const sortOrders = {
	hot: {
		title: 'Hot',
		compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) => {
			return modB.installCount - modA.installCount;
		},
	},
	mostDownloaded: {
		title: 'Most downloaded',
		compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) =>
			modB.downloadCount - modA.downloadCount,
	},
	mostViewsXDays: {
		title: `Recent views (${recentViewsDayCount} days)`,
		compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) => {
			return modB.viewCount - modA.viewCount;
		},
	},
	newest: {
		title: 'Newest',
		compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) =>
			new Date(modB.firstReleaseDate).valueOf() - new Date(modA.firstReleaseDate).valueOf(),
	},
	oldest: {
		title: 'Oldest',
		compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) =>
			new Date(modA.firstReleaseDate).valueOf() - new Date(modB.firstReleaseDate).valueOf(),
	},
	updated: {
		title: 'New updates',
		compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) =>
			new Date(modB.latestReleaseDate).valueOf() - new Date(modA.latestReleaseDate).valueOf(),
	},
} as const;

export type SortOrder = keyof typeof sortOrders;

export const isSortOrder = (key: string): key is SortOrder => {
	return Object.keys(sortOrders).includes(key);
};

export const sortModList = (
	modList: ModsRequestItem[],
	sortOrder: SortOrder,
	count = 0,
	excludeIds: string[] = []
) => {
	const sortedList = modList
		.sort(sortOrders[sortOrder].compareFunction)
		.filter((mod) => !excludeIds.includes(mod.uniqueName));
	if (count > 0) {
		return sortedList.slice(0, count);
	} else {
		return sortedList;
	}
};
