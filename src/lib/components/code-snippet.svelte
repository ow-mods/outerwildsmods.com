<script lang="ts">
	const copyElementText = ({ currentTarget }: { currentTarget: HTMLElement }) => {
		navigator.clipboard.writeText(currentTarget.innerText);
		clicked = true;
		setTimeout(() => (clicked = false), 500);
	};

	export let clicked = false;
	export let title = '';
</script>

<div>
	<div class="flex justify-between items-end">
		<span>{title}</span>
		<span class="text-xs opacity-50" class:opacity-100={clicked}>(click text to copy)</span>
	</div>
	<code
		class="text-xs text-light bg-darker opacity-60 p-1 rounded cursor-pointer break-words block whitespace-pre-wrap"
		title="Mod install badge"
		on:click={copyElementText}
		on:keydown={copyElementText}
	>
		<slot />
	</code>
</div>
