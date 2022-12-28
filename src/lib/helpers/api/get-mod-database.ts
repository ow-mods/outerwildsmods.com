import { modDatabase } from '$lib/store';
import { modDatabaseUrl } from '../constants';
import { readFromStore } from '../read-from-store';

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
	viewCount: number;
	latestReleaseDate: string;
	firstReleaseDate: string;
	required?: boolean;
	utility?: boolean;
	parent?: string;
	readme?: {
		htmlUrl: string;
		downloadUrl: string;
	};
	alpha?: boolean;
	authorDisplay?: string;
	tags: string[];
	slug: string;
	thumbnail: {
		main?: string;
		openGraph?: string;
	};
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

export const getModDatabase = async (): Promise<ModDatabase> => {
	const cachedModDatabase = await readFromStore(modDatabase);

	if (cachedModDatabase) {
		return cachedModDatabase;
	}

	const response = await fetch(modDatabaseUrl);
	if (response.status !== 200) {
		throw new Error(`Response not OK, status: ${response.status} ${response.statusText}`);
	}

	const database: ModDatabase = await response.json();

	modDatabase.set(database);

	return {
		...database,
		releases: database.releases.sort(sortReleases),
		alphaReleases: database.alphaReleases.sort(sortReleases)
	};
};
