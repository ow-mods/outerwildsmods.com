<script lang="ts">
	import { getModDatabase, type Mod, type ModDatabase } from '$lib/helpers/api/get-mod-database';
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
	let selectedEvent = 1;
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
		getPositionInTimeline(new Date(date.getFullYear(), date.getMonth() + 1, 0)) -
		getPositionInTimeline(date);

	const getYearWidth = (date: Date) =>
		getPositionInTimeline(new Date(date.getFullYear() + 1, date.getMonth(), 0)) -
		getPositionInTimeline(date);

	const scrollToEvent = (eventIndex: number) => {
		const element = document.getElementById(`event-${eventIndex}`);
		if (!element) return;

		scrollTo(getPositionInTimeline(events[eventIndex].date), 1500, 'easeInOutCubic', () =>
			console.log('done')
		);
	};

	const selectPreviousEvent = () => {
		selectEvent(selectedEvent > 0 ? selectedEvent - 1 : events.length - 1);
	};

	const selectNextEvent = () => {
		selectEvent(selectedEvent < events.length - 1 ? selectedEvent + 1 : 0);
	};

	const selectEvent = (eventIndex: number) => {
		selectedEvent = eventIndex;
		scrollToEvent(selectedEvent);
		if (selectedEvent >= revealedEvent) {
			revealedEvent = selectedEvent;
		}
	};

	onMount(() => {
		selectEvent(1);
	});

	const easing = {
		linear: function (t: number) {
			return t;
		},
		easeInQuad: function (t: number) {
			return t * t;
		},
		easeOutQuad: function (t: number) {
			return t * (2 - t);
		},
		easeInOutQuad: function (t: number) {
			return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
		},
		easeInCubic: function (t: number) {
			return t * t * t;
		},
		easeOutCubic: function (t: number) {
			return --t * t * t + 1;
		},
		easeInOutCubic: function (t: number) {
			return 0.5 * (Math.sin((t - 0.5) * Math.PI) + 1);
		},
		easeInQuart: function (t: number) {
			return t * t * t * t;
		},
		easeOutQuart: function (t: number) {
			return 1 - --t * t * t * t;
		},
		easeInOutQuart: function (t: number) {
			return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
		},
		easeInQuint: function (t: number) {
			return t * t * t * t * t;
		},
		easeOutQuint: function (t: number) {
			return 1 + --t * t * t * t * t;
		},
		easeInOutQuint: function (t: number) {
			return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
		},
	} as const;

	type Easing = keyof typeof easing;

	function scrollTo(x: number, duration: number, easingFunction: Easing, callback: () => void) {
		var start = Date.now();
		const elem = document.getElementById('timeline-scroll');
		if (!elem) return;
		const from = elem.scrollLeft;
		const to = x - elem.clientWidth / 2;

		if (from === to) {
			callback();
			return; /* Prevent scrolling to the Y point if already there */
		}

		function min(a: number, b: number) {
			return a < b ? a : b;
		}

		function scroll(timestamp: number) {
			if (!elem) return;
			var currentTime = Date.now(),
				time = min(1, (currentTime - start) / duration),
				easedT = easing[easingFunction](time);

			elem.scrollLeft = easedT * (to - from) + from;

			if (time < 1) requestAnimationFrame(scroll);
			else if (callback) callback();
		}

		requestAnimationFrame(scroll);
	}

	let mods: Mod[] = [];

	$: (async () => {
		if (mods.length > 0) return;
		mods = (await getModDatabase()).releases;
		console.log('hello', mods);
	})();
</script>

<div class="m-4">
	<div class="flex gap-2 mb-20">
		<button on:click={selectPreviousEvent} class="link button bg-darker">Previous</button>
		<button on:click={selectNextEvent} class="link button bg-darker">Next</button>
		<span>Selected: {selectedEvent}</span>
		<span>Revealed: {revealedEvent}</span>
		<span>Mods: {mods.length}</span>
	</div>
	<div class="overflow-auto" id="timeline-scroll">
		<div class="relative h-80">
			<div class="pb-8 pt-4">
				{#each years as year}
					<div
						class="absolute bg-darker py-1 rounded-full"
						style="left: {getPositionInTimeline(year)}px; width: {getYearWidth(year)}px"
					>
						<div class="relative">
							<span class="sticky left-1/2 mx-4 inline-block text-xl font-semibold">
								{year.toLocaleString('default', { year: 'numeric' })}
							</span>
						</div>
					</div>
				{/each}
			</div>
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
					class="slow-transition transition-delay absolute z-10 link"
					class:opacity-0={index > revealedEvent}
					style="left: {getPositionInTimeline(event.date)}px"
					on:click={() => selectEvent(index)}
					on:keyup={() => selectEvent(index)}
				>
					<div class="flex flex-col m-2 whitespace-nowrap relative">
						<span
							class="bg-white w-6 h-6 rounded-full slow-transition transition-delay"
							class:scale-50={selectedEvent !== index}
						/>
						<span
							class="rotate-12 top-6 left-1 absolute w-0 text-white slow-transition transition-delay"
							class:opacity-50={selectedEvent !== index}
							class:scale-50={revealedEvent < index}
						>
							{event.title}
						</span>
					</div>
				</div>
			{/each}
			{#each mods as mod}
				<div
					id="mod-{mod.uniqueName}"
					class="slow-transition transition-delay absolute z-20 link"
					style="left: {getPositionInTimeline(new Date(mod.firstReleaseDate))}px"
				>
					<div class="flex flex-col m-4 whitespace-nowrap relative opacity-75">
						<span
							class="bg-background w-2 h-2 rounded-full slow-transition transition-delay scale-75"
						/>
					</div>
				</div>
			{/each}
			<div
				style="min-width: {timelineWidth + timelineMargin * 2}px; left: {getPositionInTimeline(
					events[revealedEvent].date
				)}px"
				class="bg-accent h-2 m-4 rounded absolute timeline-line slow-transition"
			/>
		</div>
	</div>
</div>

<style>
	.slow-transition {
		transition: 1.5s;
		transition-timing-function: ease-in-out;
	}
	.transition-delay {
		transition-delay: 1.3s;
	}
	.timeline-line {
		transform: translate(-100%, 0px);
	}
</style>
