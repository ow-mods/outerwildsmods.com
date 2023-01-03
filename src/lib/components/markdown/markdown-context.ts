import type { ImageMap } from '$lib/helpers/api/get-image-map';
import { getContext, setContext } from 'svelte';

type MarkdownContext = {
	rawContentUrl?: string;
	imageMap?: ImageMap;
};

export const setMarkdownContext = <TKey extends keyof MarkdownContext>(
	contextKey: TKey,
	value: MarkdownContext[TKey]
) => setContext(contextKey, value);

export const getMarkdownContext = <TKey extends keyof MarkdownContext>(
	contextKey: TKey
): MarkdownContext[TKey] => getContext(contextKey);
