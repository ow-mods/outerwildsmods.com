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
	on:keypress={(event) => {
		if (event.key === 'Enter') {
			console.log('blur');
			event.preventDefault();
			event.currentTarget.blur();
		}
	}}
	on:change={() => console.log('change')}
/>
