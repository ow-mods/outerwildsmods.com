import type { ModsRequestItem } from '../../routes/api/mods.json';
import { recentDownloadsDayCount } from './constants';

export const sortOrderParamName = 'sortOrder' as const;

export const sortOrders = {
	hot: {
		title: 'Hot',
		compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) => {
			return modB.viewCount - modA.viewCount;
		},
	},
	mostDownloaded: {
		title: 'Most downloaded',
		compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) =>
			modB.downloadCount - modA.downloadCount,
	},
	mostDownloadedXDays: {
		title: `Recent downloads (${recentDownloadsDayCount} days)`,
		compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) => {
			return modB.recentDownloads - modA.recentDownloads;
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

export function isSortOrder(key: string): key is SortOrder {
	return Object.keys(sortOrders).includes(key);
}

export function sortModList(
	modList: ModsRequestItem[],
	sortOrder: SortOrder,
	count = 0,
	excludeIds: string[] = []
) {
	const sortedList = modList
		.sort(sortOrders[sortOrder].compareFunction)
		.filter((mod) => !excludeIds.includes(mod.uniqueName));
	if (count > 0) {
		return sortedList.slice(0, count);
	} else {
		return sortedList;
	}
}
