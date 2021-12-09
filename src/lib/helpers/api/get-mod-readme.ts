export const getModReadme = async (urls: string[]): Promise<string | null> => {
	try {
		const response = await fetch(urls[0]);
		if (response.status !== 200) {
			throw new Error(`Response not OK, status: ${(response.status, response.statusText)}`);
		}

		return response.text();
	} catch {
		if (urls.length > 1) {
			return getModReadme(urls.slice(1, urls.length));
		} else {
			console.error('Could not find readme for this mod');
			return null;
		}
	}
};
