<script lang="ts">
	import { TitleWrapper, Title, Line } from './page-section.styles';

	export let id: string;
</script>

<div class={TitleWrapper}>
	<hr class={Line} />
	<h2 class={Title} {id}><slot /></h2>
	<hr class={Line} />
</div>
