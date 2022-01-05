<script lang="ts">
	export let disabled = false;
</script>

<button on:click class={disabled ? 'button-standard' : 'button-cta'} type="submit" {disabled}>
	<slot />
</button>
