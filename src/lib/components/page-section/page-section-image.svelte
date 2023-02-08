<script lang="ts">
	export let imageUrl: string;
	export let title: string | undefined;
</script>

<div class="flex-1">
	<img class="w-full rounded border-2 border-dark" src={imageUrl} alt={title} />
</div>
