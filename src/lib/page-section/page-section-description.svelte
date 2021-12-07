<script lang="ts">
	import { SectionDescription, SectionDescriptionWrapper } from './page-section.styles';

	export let description: string | undefined;
</script>

<div class={SectionDescriptionWrapper}>
	{#if description}
		<p class={SectionDescription}>{description}</p>
	{/if}
	<slot />
</div>
