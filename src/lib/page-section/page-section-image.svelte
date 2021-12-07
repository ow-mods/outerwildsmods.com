<script lang="ts">
	import { SectionImageWrapper } from './page-section.styles';

	export let imageUrl: string;
	export let title: string | undefined;
	export let hideOnMobile = true;
	export let height = 140;
</script>

<div class={SectionImageWrapper(hideOnMobile)}>
	<img src={imageUrl} alt={title} {height} width={280} />
	<!-- priority -->
	<!-- layout="responsive" -->
</div>
