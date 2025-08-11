<script lang="ts">
	import JamCreditColumn from './jam-credit-column.svelte';

	interface Props {
		organizers: Record<string, string>;
		judges: Record<string, string>;
		donators: Record<string, string>;
	}

	let { organizers, judges, donators }: Props = $props();
</script>

<div class="flex flex-col justify-evenly items-center md:flex-row md:items-start gap-8">
	<JamCreditColumn title="Organizers" people={organizers} />
	<JamCreditColumn title="Judges" people={judges} />
	<JamCreditColumn title="Donators" people={donators} />
</div>
