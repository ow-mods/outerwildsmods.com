<script lang="ts">
	export let href: string | undefined;
</script>

{#if href}
	<a
		{href}
		sveltekit:prefetch
		class="link block max-w-sm mx-auto bg-dark w-full h-full rounded overflow-hidden hover:bg-background outline-4 outline-dark hover:outline"
	>
		<slot />
	</a>
{:else}
	<div
		class="max-w-sm mx-auto bg-dark w-full h-full rounded overflow-hidden hover:bg-background outline-4 outline-dark hover:outline"
	>
		<slot />
	</div>
{/if}
