<script lang="ts">
	const copyElementText = ({ currentTarget }: { currentTarget: HTMLElement }) => {
		window.getSelection()?.selectAllChildren(currentTarget);
		navigator.clipboard.writeText(currentTarget.innerText);
	};
</script>

<code
	class="text-xs text-light opacity-60 bg-darker p-1 rounded leading-none cursor-pointer break-words block"
	title="Mod install badge"
	on:click={copyElementText}
	on:keypress={copyElementText}
>
	<slot />
</code>
