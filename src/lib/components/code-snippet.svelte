<script lang="ts">
	const copyElementText = ({ currentTarget }: { currentTarget: HTMLElement }) => {
		navigator.clipboard.writeText(currentTarget.innerText);
		clicked = true;
		setTimeout(() => (clicked = false), 500);
	};

	interface Props {
		clicked?: boolean;
		title?: string;
		children?: import('svelte').Snippet;
	}

	let { clicked = $bindable(false), title = '', children }: Props = $props();
</script>

<div>
	<div class="flex justify-between items-end">
		<span>{title}</span>
		<span class="text-xs opacity-50" class:opacity-100={clicked}>(click text to copy)</span>
	</div>
	<code
		class="text-xs text-light bg-darker opacity-60 p-1 rounded cursor-pointer break-words block whitespace-pre-wrap"
		title="Mod install badge"
		onclick={copyElementText}
		onkeydown={copyElementText}
	>
		{@render children?.()}
	</code>
</div>
