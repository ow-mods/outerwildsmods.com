<script lang="ts">
	export let description: string | undefined;
	let value = description;
</script>

<div class="relative">
	<textarea
		bind:value
		placeholder="Type your addon description here."
		class="resize-none bg-transparent w-full"
		rows="2"
		maxlength="150"
	/>
	<span class="absolute bottom-0 right-0 opacity-50 pointer-events-none text-lg">✏️</span>
</div>
