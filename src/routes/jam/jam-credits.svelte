<script lang="ts">
	import JamCreditColumn from './jam-credit-column.svelte';

	export let organizers: Record<string, string>;
	export let judges: Record<string, string>;
	export let donators: Record<string, string>;
</script>

<div class="flex flex-col justify-evenly items-center md:flex-row md:items-start gap-8">
	<JamCreditColumn title="Organizers" people={organizers} />
	<JamCreditColumn title="Judges" people={judges} />
	<JamCreditColumn title="Donators" people={donators} />
</div>
