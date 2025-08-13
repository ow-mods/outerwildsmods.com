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
	<button
		class="text-xs text-light bg-darker opacity-60 p-1 rounded cursor-pointer break-words block whitespace-pre-wrap text-left w-full font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
		title="Mod install badge - Click to copy"
		onclick={copyElementText}
		aria-label="Copy code snippet to clipboard"
		onkeydown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				copyElementText(event);
			}
		}}
	>
		{@render children?.()}
	</button>
</div>
