<script lang="ts">
	export let value = '';
	export let placeholder = '';
</script>

<div class="relative">
	<div class="relative">
		<textarea
			bind:value
			{placeholder}
			class="resize-none bg-transparent w-full"
			rows="2"
			maxlength="150"
		/>
		<span class="absolute bottom-0 right-0 opacity-50 pointer-events-none">✏️</span>
	</div>
</div>
