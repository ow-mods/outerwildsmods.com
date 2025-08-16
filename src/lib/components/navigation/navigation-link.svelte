<script lang="ts">
	import { navigating, page } from '$app/state';

	interface Props {
		href: string;
		exact?: boolean;
		label?: string;
		children?: import('svelte').Snippet;
	}

	let { href, exact = false, label = '', children }: Props = $props();
	const isActive = $derived(
		(() => {
			const url = navigating.to?.url ?? page.url;
			const pathName: string = url.pathname;
			return exact ? pathName === href : pathName.startsWith(href);
		})()
	);
</script>

<a
	class:text-light={isActive}
	class:bg-opacity-100={isActive}
	class:bg-opacity-50={!isActive}
	class:link={!isActive}
	class="bg-background text-sm py-1 px-2 rounded xs:rounded-b-none font-normal relative whitespace-nowrap"
	{href}
>
	{#if label}
		<span
			class="text-xs pointer-events-none font-semibold bg-cta px-1 rounded text-white absolute rotate-12 -top-3 -right-4 whitespace-nowrap"
		>
			{label}
		</span>
	{/if}
	{@render children?.()}
</a>
