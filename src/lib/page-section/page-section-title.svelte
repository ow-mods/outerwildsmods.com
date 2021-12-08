<script lang="ts">
	import HrLine from '$lib/hr-line.svelte';
	import { TitleWrapper, Title } from './page-section.styles';

	export let id: string;
</script>

<div class={TitleWrapper}>
	<HrLine />
	<h2 class={Title} {id}><slot /></h2>
	<HrLine />
</div>
