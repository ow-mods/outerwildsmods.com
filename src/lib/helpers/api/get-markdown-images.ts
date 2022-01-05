import { Parser } from 'commonmark';

export const getAllMarkdownImages = (markdown: string | null): string[] => {
	if (!markdown) return [];

	const parsed = new Parser().parse(markdown);
	const walker = parsed.walker();
	let event;
	const nodeList = [];
	while ((event = walker.next())) {
		const node = event.node;
		if (node.type === 'image' && node.destination) {
			nodeList.push(node);
		}
	}
	const list = nodeList.map((node) => node.destination ?? '');
	const uniqueSrcList = Array.from(new Set(list));

	return uniqueSrcList;
};
