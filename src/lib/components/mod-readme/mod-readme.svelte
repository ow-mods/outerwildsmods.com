<script lang="ts">
	export let readmeHtml: string;
</script>

<div class="markdown">
	<!-- Render readme string as html, the string is already html -->
	{@html readmeHtml}
</div>

<style>
	.markdown :global(h1) {
		margin: 0;
	}

	/* If the first thing in the markdown is a p, we don't want the margin since ugly */
	.markdown > :global(p:first-child) {
		margin: 0;
	}

	.markdown :global(pre) {
		padding: theme('spacing.4');
		overflow: auto;
	}

	.markdown :global(pre),
	.markdown :global(code) {
		background: theme('colors.dark');
		border-radius: theme('borderRadius.DEFAULT');
		padding: theme('spacing.1');
		white-space: pre-wrap;
		word-break: break-word;
	}

	.markdown :global(table) {
		border-collapse: collapse;
		width: 100%;
	}

	.markdown :global(table),
	.markdown :global(th),
	.markdown :global(td) {
		border: 1px solid theme('colors.light');
	}

	.markdown :global(td) {
		padding: theme('spacing.2');
	}

	.markdown :global(li) {
		padding: theme('spacing.1') 0;
	}

	.markdown :global(img) {
		display: inline-block;
		height: auto;
	}

	.markdown :global(a),
	.markdown :global(summary) {
		color: theme('colors.accent');
		cursor: pointer;
		word-break: break-word;

		&:hover {
			filter: brightness(1.25);
		}
	}

	.markdown :global(details) {
		background-color: theme('colors.dark');
		border-radius: theme('borderRadius.DEFAULT');
		padding: 0 theme('spacing.2');
	}
</style>
