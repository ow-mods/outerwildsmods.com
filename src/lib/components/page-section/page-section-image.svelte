<script lang="ts">
	export let imageUrl: string;
	export let title: string | undefined;
	export let height = 140;
</script>

<div class="flex-1">
	<img
		class="w-full object-cover rounded border-2 border-dark"
		src={imageUrl}
		alt={title}
		{height}
	/>
	<!-- priority -->
	<!-- layout="responsive" -->
</div>
