const readmeNames = ['README.md', 'readme.md', 'Readme.md'];

export const getModReadme = async (rawContentUrl: string): Promise<string | null> => {
	const readmePaths = readmeNames.map((readmeName) => `${rawContentUrl}/${readmeName}`);

	for (const readmePath of readmePaths) {
		const readme = await tryGetModReadme(readmePath);
		if (readme) {
			return readme;
		}
	}

	return null;
};

const tryGetModReadme = async (readmePath: string) => {
	const response = await fetch(readmePath);
	return response.status === 200 ? response.text() : null;
};
