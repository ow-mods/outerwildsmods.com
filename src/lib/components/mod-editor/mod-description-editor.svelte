<script lang="ts">
	export let value = '';
</script>

<div class="relative">
	<div class="relative">
		<textarea
			bind:value
			placeholder="Type your addon description here."
			class="resize-none bg-transparent w-full"
			rows="2"
			maxlength="150"
		/>
		<span class="absolute bottom-0 right-0 opacity-50 pointer-events-none">✏️</span>
	</div>
</div>
