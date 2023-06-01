<script lang="ts">
	import { getModDatabase, type Mod, type ModDatabase } from '$lib/helpers/api/get-mod-database';
	import { onMount } from 'svelte';

	type Event = {
		date: Date;
		title: string;
	};

	const events: Event[] = [
		{
			date: new Date('2012/12/10'),
			title: 'Outer Wilds Alpha',
		},
		{
			date: new Date('2019/05/28'),
			title: 'Outer Wilds released',
		},
		{
			date: new Date('2019/06/08'),
			title: 'TAImatem joins',
		},
		{
			date: new Date('2019/12/08'),
			title: 'Alek joins',
		},
		{
			date: new Date('2019/12/18'),
			title: 'First OWML release',
		},
		{
			date: new Date('2019/12/28'),
			title: '_nebula joins',
		},
		{
			date: new Date('2020/01/03'),
			title: 'Nexus Mods page created',
		},
		{
			date: new Date('2020/01/04'),
			title: 'Raicuparta joins',
		},
		{
			date: new Date('2020/01/06'),
			title: 'First NomaiVR release',
		},
		{
			date: new Date('2020/02/01'),
			title: 'Logan emails',
		},
		{
			date: new Date('2020/03/01'),
			title: 'First QSB release',
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
		{
			date: new Date(),
			title: 'Present',
		},
	];

	const firstEvent = events[0];
	const lastEvent = events[events.length - 1];

	const minimumTimestamp = firstEvent.date.valueOf();
	const maximumTimestamp = lastEvent.date.valueOf();
	const timelineWidth = 50000;
	const timelineMargin = 1000;
	const monthYearMargin = 2;
	let transitionTimeMs = 500;
	let selectedEvent = 1;
	let eventInProgress = 1;
	let revealedEvent = 0;

	const initialMonth = firstEvent.date.getMonth();
	const initialYear = firstEvent.date.getFullYear();
	const finalMonth = lastEvent.date.getMonth();
	const finalYear = lastEvent.date.getFullYear();
	const months: Date[] = [];
	const years: Date[] = [];

	for (let year = initialYear; year <= finalYear; year++) {
		years.push(new Date(year, 0, 1));
		for (let month = 0; month < 12; month++) {
			months.push(new Date(year, month, 1));
		}
	}

	const getPositionInTimeline = (date: Date) =>
		((date.valueOf() - minimumTimestamp) / (maximumTimestamp - minimumTimestamp)) * timelineWidth +
		timelineMargin;

	const getMonthWidth = (date: Date) =>
		getPositionInTimeline(new Date(date.getFullYear(), date.getMonth() + 1, 1)) -
		getPositionInTimeline(date) -
		monthYearMargin * 2;

	const getYearWidth = (date: Date) =>
		getPositionInTimeline(new Date(date.getFullYear() + 1, date.getMonth(), 1)) -
		getPositionInTimeline(date) -
		monthYearMargin * 2;

	const scrollToEvent = (eventIndex: number) => {
		const element = document.getElementById(`event-${eventIndex}`);
		if (!element) return;

		scrollTo(eventIndex, transitionTimeMs);
	};

	const selectPreviousEvent = () => {
		selectEvent(selectedEvent > 0 ? selectedEvent - 1 : events.length - 1);
	};

	const selectNextEvent = () => {
		selectEvent(selectedEvent < events.length - 1 ? selectedEvent + 1 : 0);
	};

	const selectEvent = (eventIndex: number) => {
		if (eventIndex >= eventInProgress) {
			eventInProgress = eventIndex;
		}
		scrollToEvent(eventIndex);
	};

	onMount(() => {
		selectEvent(1);
	});

	// Close enough to easeInOut used in CSS.
	const easeInOutCubic = (t: number) => 0.5 * (Math.sin((t - 0.5) * Math.PI) + 1);

	const scrollTo = (eventIndex: number, duration: number) => {
		var start = Date.now();
		const elem = document.getElementById('timeline-scroll');
		if (!elem) return;
		const from = elem.scrollTop;
		const y = getPositionInTimeline(events[eventIndex].date);
		const to = y - elem.clientHeight / 2;

		if (from === to) {
			return;
		}

		function scroll() {
			if (!elem) return;
			var currentTime = Date.now(),
				time = Math.min(1, (currentTime - start) / duration),
				easedT = easeInOutCubic(time);

			elem.scrollTop = easedT * (to - from) + from;

			if (time < 1) requestAnimationFrame(scroll);
			else {
				if (revealedEvent < eventIndex) revealedEvent = eventIndex;
				selectedEvent = eventIndex;
			}
		}

		requestAnimationFrame(scroll);
	};

	let mods: Mod[] = [];

	$: (async () => {
		if (mods.length > 0) return;
		mods = (await getModDatabase()).releases;
	})();
</script>

<div style="--transition-time: {transitionTimeMs}ms;">
	<div class="flex gap-2 mb-20 fixed flex-col z-30">
		<button on:click={selectPreviousEvent} class="link button bg-darker">Previous</button>
		<button on:click={selectNextEvent} class="link button bg-darker">Next</button>
		<span>Transitions: {transitionTimeMs}ms</span>
		<input type="range" min={0} max={3000} bind:value={transitionTimeMs} />
		<span>Selected: {selectedEvent}</span>
		<span>Revealed: {revealedEvent}</span>
		<span>Mods: {mods.length}</span>
	</div>
	<div id="timeline-scroll" class="overflow-auto relative wrapper">
		<div
			class="h-screen flex justify-center w-full gap-4"
			style="min-height: {timelineWidth + timelineMargin * 2}px;"
		>
			<div class="relative w-24">
				{#each years as year}
					<div
						class="absolute bg-darker px-1 rounded-3xl slow-transition w-full text-center"
						class:opacity-50={year.getFullYear() !== events[selectedEvent].date.getFullYear()}
						style="top: {getPositionInTimeline(year) + monthYearMargin}px; height: {getYearWidth(
							year
						)}px"
					>
						<div class="relative h-full">
							<span class="sticky top-1/2 m-4 inline-block text-xl font-semibold">
								{year.toLocaleString('default', { year: 'numeric' })}
							</span>
						</div>
					</div>
				{/each}
			</div>
			<div class="relative w-32">
				{#each months as month}
					<div
						class="absolute bg-darker text-center py-1 rounded-3xl slow-transition w-full"
						class:opacity-50={month.getFullYear() !== events[selectedEvent].date.getFullYear() ||
							month.getMonth() !== events[selectedEvent].date.getMonth()}
						style="top: {getPositionInTimeline(month) + monthYearMargin}px; height: {getMonthWidth(
							month
						)}px"
					>
						<div class="relative h-full">
							<span class="sticky top-1/2 m-4 inline-block font-semibold">
								{month.toLocaleString('default', { month: 'long' })}
							</span>
						</div>
					</div>
				{/each}
			</div>
			<div class="relative w-96 flex justify-center">
				{#each events as event, index}
					<div
						id="event-{index}"
						class="slow-transition absolute z-10 link flex items-center h-0"
						class:opacity-0={index > revealedEvent}
						style="top: {getPositionInTimeline(event.date)}px"
						on:click={() => selectEvent(index)}
						on:keyup={() => selectEvent(index)}
					>
						<div class="flex gap-4 m-2 relative items-center">
							<span
								class="bg-white w-6 h-6 rounded-3xl slow-transition"
								class:scale-50={selectedEvent !== index}
							/>
							<span
								class="absolute text-white slow-transition w-44 leading-none will-change-transform text-xl"
								class:left-10={index % 2 === 0}
								class:right-10={index % 2 !== 0}
								class:origin-left={index % 2 === 0}
								class:origin-right={index % 2 !== 0}
								class:text-right={index % 2 !== 0}
								class:opacity-40={selectedEvent !== index}
								class:scale-75={selectedEvent !== index}
							>
								{event.title}
							</span>
						</div>
					</div>
				{/each}
				{#each mods as mod}
					<div
						id="mod-{mod.uniqueName}"
						class="slow-transition absolute z-20 link"
						style="top: {getPositionInTimeline(new Date(mod.firstReleaseDate))}px"
					>
						<div class="flex flex-col m-4 whitespace-nowrap relative opacity-75">
							<span class="bg-background w-2 h-2 rounded-3xl slow-transition scale-75" />
						</div>
					</div>
				{/each}
				<div
					style="min-height: {timelineWidth + timelineMargin * 2}px; top: {getPositionInTimeline(
						events[eventInProgress].date
					)}px;"
					class="bg-accent w-2 mx-4 rounded absolute timeline-line slow-transition"
				/>
			</div>
		</div>
	</div>
</div>

<style>
	.wrapper {
		max-height: calc(100vh - 184px);
	}
	.slow-transition {
		transition: var(--transition-time);
		transition-timing-function: ease-in-out;
	}
	.timeline-line {
		transform: translate(0, -100%);
	}
</style>
