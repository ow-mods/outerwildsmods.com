import type { Mod } from './get-mod-list';
import { uniq } from 'lodash-es';

export const getAuthors = (mods: Mod[]) => {
	return uniq(
		mods
			.map((mod) => mod.authorDisplay?.split(/,|and|&/) ?? [mod.author])
			.flat()
			.map((author) => author.trim())
			.filter((author) => author && author.toLowerCase() !== 'friends')
			.sort()
	);
};
