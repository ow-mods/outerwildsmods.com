export const getFullImageUrl = (rawContentUrl: string, imageUrl: string) => {
	return imageUrl.startsWith('http')
		? // GitHub allows embedding images that actually point to webpages on github.com, so we have to replace the URLs here
			imageUrl.replace(
				/^https?:\/\/github.com\/(.+)\/(.+)\/blob\/(.+)\//gm,
				'https://raw.githubusercontent.com/$1/$2/$3/'
			)
		: // For relative URLs we also have to resolve them
			`${rawContentUrl}/${imageUrl}`;
};
