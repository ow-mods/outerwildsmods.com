<script lang="ts" context="module">
	export type ButtonVariant = 'primary' | 'secondary' | 'main-download';
</script>

<script lang="ts">
	export let variant: ButtonVariant = 'secondary';
	export let isExternal = false;
	export let href: string | undefined = undefined;
	export let rel: string | undefined = undefined;
</script>

<a
	class={`block rounded p-1 font-bold mx-auto border-4 border-transparent hover:border-cta-dark active:bg-cta-dark ${
		variant === 'secondary' ? 'bg-accent text-dark' : 'bg-cta text-white'
	}`}
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
>
	<div class="h-full w-full pointer-events-none text-center"><slot /></div>
</a>
