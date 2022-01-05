<script lang="ts">
	export let value = '';
	export let placeholder = '';
</script>

<textarea
	bind:value
	placeholder="{placeholder} ✏️"
	class="resize-none bg-transparent w-full"
	rows="2"
	maxlength="150"
	on:input={(event) => (value = event.currentTarget.value.replace(/\n/g, ' '))}
/>
