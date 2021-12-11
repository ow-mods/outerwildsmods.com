<script lang="ts">
	export let href: string;
</script>

<a {href} class="link" rel="noopener noreferrer">
	<slot />
</a>
