export const listedImageSize = {
	width: 300,
	height: 100,
} as const;

export const websiteUrl = 'https://outerwildsmods.com';

// Some submissions were uploaded slightly after the end date
// so we add this threshold to include those mods in the jam lists.
export const jamTimestampThreshold = 3600000;

const databaseUrlBase = 'https://ow-mods.github.io/ow-mod-db';
export const thumbnailUrlBase = `${databaseUrlBase}/thumbnails`;
export const modDatabaseUrl = `${databaseUrlBase}/database.json`;
export const linkedFromNotificationParamName = 'linked-from-notification';
export const downloadHistoryUrl =
	'https://ow-mods.github.io/ow-mod-download-history/download-history.json';
export const managerInstallProtocol = 'owmods://install-mod';
export const owmlUniqueName = 'Alek.OWML';
export const commentsSectionId = 'page-comments';
