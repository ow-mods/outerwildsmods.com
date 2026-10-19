<script lang="ts">
	interface Props {
		readmeHtml: string;
	}

	let { readmeHtml }: Props = $props();
</script>

<div class="markdown">
	<!-- Render readme string as html, the string is already html -->
	{@html readmeHtml}
</div>
