<script lang="ts">
	const copyElementText = ({ currentTarget }: { currentTarget: HTMLElement }) => {
		window.getSelection()?.selectAllChildren(currentTarget);
		navigator.clipboard.writeText(currentTarget.innerText);
	};

	export let title = '';
</script>

<div>
	<div class="flex justify-between items-end">
		<span>{title}</span>
		<span class="text-xs opacity-50">(click text to copy)</span>
	</div>
	<code
		class="text-xs text-light opacity-60 bg-darker p-1 rounded leading-none cursor-pointer break-words block"
		title="Mod install badge"
		on:click={copyElementText}
		on:keypress={copyElementText}
	>
		<slot />
	</code>
</div>
