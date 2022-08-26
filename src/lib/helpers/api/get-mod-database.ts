const DATABASE_URL = 'https://raw.githubusercontent.com/ow-mods/ow-mod-db/master/database.json';

export type Mod = {
	name: string;
	uniqueName: string;
	author: string;
	description: string;
	version: string;
	repo: string;
	downloadUrl: string;
	downloadCount: number;
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

function sortReleases(releaseA: Mod, releaseB: Mod) {
	return releaseB.downloadCount - releaseA.downloadCount;
}

export async function getModDatabase(): Promise<ModDatabase> {
	const response = await fetch(DATABASE_URL);
	if (response.status !== 200) {
		throw new Error(`Response not OK, status: ${response.status} ${response.statusText}`);
	}

	const database: ModDatabase = await response.json();

	return {
		...database,
		releases: database.releases.sort(sortReleases),
		alphaReleases: database.alphaReleases.sort(sortReleases),
	};
}
