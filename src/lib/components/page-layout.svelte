<script lang="ts">
	export let isWide = false;
</script>

<div class="{isWide ? 'max-w-screen-lg' : 'max-w-screen-sm'} p-4 mx-auto">
	<slot />
</div>
