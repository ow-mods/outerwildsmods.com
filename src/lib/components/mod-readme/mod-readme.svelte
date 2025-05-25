<script lang="ts">
	export let readmeHtml: string;
</script>

<div>
	<!-- Render readme string as html, the string is already html -->
	{@html readmeHtml}
</div>

<style>
	:global(h1) {
		margin: 0;
	}

	/* If the first thing in the markdown is a p, we don't want the margin since ugly */
	& > :global(p:first-child) {
		margin: 0;
	}

	:global(pre) {
		padding: theme('spacing.4');
		overflow: auto;
	}

	:global(pre),
	:global(code) {
		background: theme('colors.dark');
		border-radius: theme('borderRadius.DEFAULT');
		padding: theme('spacing.1');
		white-space: pre-wrap;
		word-break: break-all;
	}

	:global(table) {
		border-collapse: collapse;
		width: 100%;
	}

	:global(table),
	:global(th),
	:global(td) {
		border: 1px solid theme('colors.light');
	}

	:global(td) {
		padding: theme('spacing.2');
	}

	:global(li) {
		padding: theme('spacing.1') 0;
	}

	:global(img) {
		display: inline-block;
		height: auto;
	}

	:global(a),
	:global(summary) {
		color: theme('colors.accent');

		&:hover {
			filter: brightness(1.25);
		}

		cursor: pointer;
	}
</style>
