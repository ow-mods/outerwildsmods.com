<script lang="ts">
	import JamCreditColumn from './jam-credit-column.svelte';

	const organizers = {
		xen: 'xen-42',
		Idiot: 'Bwc9876',
		_nebula: 'misternebula',
		JohnCorby: 'JohnCorby',
		Raicuparta: 'Raicuparta',
	};

	const judges = {
		Bird: '',
		Book: 'Nageld',
		Bunnie: 'BUNN1E5',
		MegaPiggy: 'MegaPiggy',
		Vesper: 'Vesper-Works',
		_nebula: 'misternebula',
		JohnCorby: 'JohnCorby',
		xen: 'xen-42',
	};

	const donators = {
		_nebula: 'misternebula',
		Raicuparta: 'Raicuparta',
		xen: 'xen-42',
		Book: 'Nageld',
		Pixie: 'https://www.reddit.com/user/littlemetalpixie',
	};
</script>

<div class="flex flex-col justify-evenly items-center md:flex-row md:items-start gap-8">
	<JamCreditColumn title="Organizers" people={organizers} />
	<JamCreditColumn title="Judges" people={judges} />
	<JamCreditColumn title="Donators" people={donators} />
</div>
