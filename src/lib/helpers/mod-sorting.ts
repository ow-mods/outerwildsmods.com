import type { ModsRequestItem } from '../../routes/api/mods.json';

const referenceScoreMilliseconds = 6 * 30 * 24 * 60 * 60 * 1000;
const downloadRatioNeededToBeHotter = 2;
const minScoreDate = new Date('2021-05-01').valueOf();
export const sortOrderParamName = 'sortOrder' as const;

const calculateScore = (mod: ModsRequestItem) => {
	const time = Date.now() - Math.max(0, new Date(mod.firstReleaseDate).valueOf() - minScoreDate);

	return (
		Math.log10(mod.downloadCount) / Math.log10(downloadRatioNeededToBeHotter) -
		time / referenceScoreMilliseconds
	);
};

export const sortOrders = {
	hot: {
		title: 'Hot',
		compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) => {
			return calculateScore(modB) - calculateScore(modA);
		},
	},
	mostDownloaded: {
		title: 'Most downloaded',
		compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) =>
			modB.downloadCount - modA.downloadCount,
	},
	leastDownloaded: {
		title: 'Least downloaded',
		compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) =>
			modA.downloadCount - modB.downloadCount,
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
