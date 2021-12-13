import type { Writable } from 'svelte/store';

export const readFromStore = <TStore>(store: Writable<TStore>) =>
	new Promise<TStore>((resolve) => {
		store.subscribe((store) => resolve(store));
	});
