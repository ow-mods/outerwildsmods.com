<script lang="ts">
	import { onMount } from 'svelte';

	type Event = {
		date: Date;
		title: string;
	};

	const events: Event[] = [
		{
			date: new Date('2013/5/5'),
			title: 'Outer Wilds Alpha',
		},
		{
			date: new Date('2019/05/28'),
			title: 'Outer Wilds released',
		},
		{
			date: new Date('2019/06/15'),
			title: 'TAImatem',
		},
		{
			date: new Date('2019/12/5'),
			title: 'AmazingAlek, OWML',
		},
		{
			date: new Date('2019/12/28'),
			title: '_nebula',
		},
		{
			date: new Date('2020/01/02'),
			title: 'Raicuparta, NomaiVR',
		},
		{
			date: new Date('2020/01/15'),
			title: 'nexusmods.com',
		},
		{
			date: new Date('2020/02/02'),
			title: 'QSB',
		},
		{
			date: new Date('2020/02/15'),
			title: 'Logan emails',
		},
		{
			date: new Date('2020/03/15'),
			title: 'Modders join OWML team',
		},
		{
			date: new Date('2020/04/10'),
			title: 'Marshmallow',
		},
		{
			date: new Date('2020/04/20'),
			title: 'Mod manager',
		},
		{
			date: new Date('2020/05/15'),
			title: 'Mod database',
		},
		{
			date: new Date('2020/06/15'),
			title: 'Mods website',
		},
		{
			date: new Date('2020/08/15'),
			title: 'Alpha modding',
		},
		{
			date: new Date('2021/04/15'),
			title: 'DLC leak',
		},
		{
			date: new Date('2021/06/15'),
			title: 'DLC announced',
		},
		{
			date: new Date('2021/08/15'),
			title: 'JohnCorby',
		},
		{
			date: new Date('2021/09/5'),
			title: 'Logan joins Discord',
		},
		{
			date: new Date('2021/09/25'),
			title: 'DLC releases',
		},
		{
			date: new Date('2021/11/15'),
			title: 'Xen',
		},
		{
			date: new Date('2021/12/15'),
			title: 'New Horizons',
		},
		{
			date: new Date('2022/01/15'),
			title: 'Modding Discord server',
		},
	];

	const firstEvent = events[0];
	const lastEvent = events[events.length - 1];

	const min = firstEvent.date.valueOf();
	const max = lastEvent.date.valueOf();
	const timelineWidth = 50000;
	const timelineMargin = 1000;
	let selectedEvent = 1;

	const initialMonth = firstEvent.date.getMonth();
	const initialYear = firstEvent.date.getFullYear();
	const finalMonth = lastEvent.date.getMonth();
	const finalYear = lastEvent.date.getFullYear();
	const months: Date[] = [];

	for (let year = initialYear; year < finalYear; year++) {
		for (let month = 0; month < 12; month++) {
			months.push(new Date(year, month, 1));
		}
	}

	const getPositionInTimeline = (date: Date) =>
		((date.valueOf() - min) / (max - min)) * timelineWidth + timelineMargin;

	const getMonthWidth = (date: Date) =>
		getPositionInTimeline(new Date(date.getFullYear(), date.getMonth() + 1, 0)) -
		getPositionInTimeline(date);

	const scrollToEvent = (eventIndex: number) => {
		document
			.getElementById(`event-${eventIndex}`)
			?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
	};

	const previous = () => {
		selectEvent(Math.max(0, selectedEvent - 1));
	};

	const next = () => {
		selectEvent(Math.min(events.length - 1, selectedEvent + 1));
	};

	const selectEvent = (eventIndex: number) => {
		selectedEvent = eventIndex;
		scrollToEvent(selectedEvent);
	};

	onMount(() => {
		selectEvent(1);
	});
</script>

<div class="m-4">
	<div class="flex gap-2">
		<button on:click={previous} class="link button bg-darker">Previous</button>
		<button on:click={next} class="link button bg-darker">Next</button>
	</div>
	<div class="overflow-hidden">
		<div class="relative h-40">
			<div class="pb-8 pt-4">
				{#each months as month}
					<div
						class="absolute bg-darker text-center py-1 rounded-full"
						style="left: {getPositionInTimeline(month)}px; width: {getMonthWidth(month)}px"
					>
						{month.toLocaleString('default', { month: 'long' })}
					</div>
				{/each}
			</div>
			{#each events as event, index}
				<div
					id="event-{index}"
					class="absolute z-10 link"
					style="left: {getPositionInTimeline(event.date)}px"
					on:click={() => selectEvent(index)}
					on:keyup={() => selectEvent(index)}
				>
					<div class="flex flex-col m-2 whitespace-nowrap relative">
						<span
							class="bg-white w-6 h-6 rounded-full transition"
							class:scale-50={selectedEvent !== index}
						/>
						<span
							class="rotate-12 top-6 left-1 absolute w-0 text-white"
							class:opacity-50={selectedEvent !== index}>{event.title}</span
						>
					</div>
				</div>
			{/each}
			<div
				style="min-width: {timelineWidth + timelineMargin * 2}px"
				class="bg-accent h-2 m-4 rounded absolute"
			/>
		</div>
	</div>
</div>
