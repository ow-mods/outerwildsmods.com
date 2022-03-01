<script lang="ts">
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import LinkButton from '$lib/components/button/link-button.svelte';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';
	import FeaturedModRow from './featured-mod-row.svelte';
	import { SortOrder, sortOrderParamName, sortOrders } from '$lib/helpers/mod-sorting';

	export let mods: ModsRequestItem[];
	export let addons: ModsRequestItem[];
	export let sortOrder: SortOrder;
</script>

<PageSection title={sortOrders[sortOrder].title} id={sortOrder}>
	<div class="flex flex-col gap-4">
		<FeaturedModRow {mods}>
			<LinkButton href="/mods?{sortOrderParamName}={sortOrder}">More Mods ›</LinkButton>
		</FeaturedModRow>
		<FeaturedModRow mods={addons}>
			<LinkButton href="/custom-worlds?{sortOrderParamName}={sortOrder}">More Worlds ›</LinkButton>
		</FeaturedModRow>
	</div>
</PageSection>
