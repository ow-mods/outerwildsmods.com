import { modDatabaseUrl } from '../constants';

export type Mod = {
	name: string;
	uniqueName: string;
	author: string;
	description: string;
	version: string;
	repo: string;
	downloadUrl: string;
	downloadCount: number;
	installCount: number;
	weeklyViewCount: number;
	weeklyInstallCount: number;
	viewCount: number;
	latestReleaseDate: string;
	firstReleaseDate: string;
	repoUpdatedAt: string;
	databaseEntryUpdatedAt: string;
	latestReleaseDescription?: string;
	latestPrereleaseDescription?: string;
	required?: boolean;
	utility?: boolean;
	parent?: string;
	readme?: {
		htmlUrl: string;
		downloadUrl: string;
	};
	prerelease?: {
		version: string;
		downloadUrl: string;
		date: string;
	};
	alpha?: boolean;
	authorDisplay?: string;
	tags: string[];
	slug: string;
	thumbnail: {
		main?: string;
		openGraph?: string;
	};
	repoVariations?: string[];
};

export interface ModWithImage extends Mod {
	imageUrl: string | null;
}

export type ModManager = {
	version: string;
	downloadUrl: never; // Legacy download URL, shouldn't be used.
	installerDownloadUrl: string;
	zipDownloadUrl: string;
	downloadCount: number;
};

export type ModDatabase = {
	modManager: ModManager;
	releases: Mod[];
	alphaReleases: Mod[];
};

const sortReleases = (releaseA: Mod, releaseB: Mod) => {
	return releaseB.downloadCount - releaseA.downloadCount;
};

let cachedModDatabase: ModDatabase | undefined;

export const getModDatabase = async (): Promise<ModDatabase> => {
	if (cachedModDatabase) {
		return cachedModDatabase;
	}

	const response = await fetch(modDatabaseUrl);
	if (response.status !== 200) {
		throw new Error(`Response not OK, status: ${response.status} ${response.statusText}`);
	}

	const database: ModDatabase = await response.json();

	cachedModDatabase = database;

	return {
		...database,
		releases: database.releases.sort(sortReleases),
		alphaReleases: database.alphaReleases.sort(sortReleases),
	};
};
