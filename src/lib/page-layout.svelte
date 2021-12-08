<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	let className = '';
	export { className as class };
	export let isWide = false;
</script>

<div class={twMerge(`${isWide ? 'max-w-screen-md' : 'max-w-screen-sm'} p-4 mx-auto`, className)}>
	<slot />
</div>
