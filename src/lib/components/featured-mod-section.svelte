<script lang="ts">
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import LinkButton from '$lib/components/button/link-button.svelte';
	import type { ModsRequestItem } from 'src/routes/api/mods.json/+server';
	import FeaturedModRow from './featured-mod-row.svelte';
	import { type SortOrder, sortOrderParamName } from '$lib/helpers/mod-sorting';

	export let mods: ModsRequestItem[];
	export let sortOrder: SortOrder;
	export let title: string;
</script>

<PageSection {title} id={sortOrder}>
	<div class="flex flex-col gap-4">
		<FeaturedModRow {mods}>
			<LinkButton href="/mods?{sortOrderParamName}={sortOrder}">More Mods ›</LinkButton>
		</FeaturedModRow>
	</div>
</PageSection>
