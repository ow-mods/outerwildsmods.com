<script lang="ts">
	import { run } from 'svelte/legacy';

	import { getModList, type Mod } from '$lib/helpers/api/get-mod-list';
	import { sortBy } from 'lodash-es';
	import { onMount } from 'svelte';

	type Event = {
		date: Date;
		title: string;
	};

	const events: Event[] = [
		{
			date: new Date(0),
			title: 'The Big Bang',
		},
		{
			date: new Date('2011/6/15'),
			title: 'Spaceworthy',
		},
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
			date: new Date('2020/04/12'),
			title: 'First Marshmallow release',
		},
		{
			date: new Date('2020/04/14'),
			title: 'First Mod Manager release',
		},
		{
			date: new Date('2020/04/22'),
			title: 'Locochoco joins',
		},
		{
			date: new Date('2020/05/08'),
			title: 'Mod database created',
		},
		{
			date: new Date('2020/06/29'),
			title: 'Mods website created',
		},
		{
			date: new Date('2020/07/28'),
			title: 'Loco starts modding the Alpha',
		},
		{
			date: new Date('2021/04/28'),
			title: 'DLC leaked',
		},
		{
			date: new Date('2021/06/03'),
			title: 'MegaPiggy joins',
		},
		{
			date: new Date('2021/07/29'),
			title: 'DLC announced',
		},
		{
			date: new Date('2021/08/1'),
			title: 'JohnCorby joins',
		},
		{
			date: new Date('2021/09/26'),
			title: 'Logan popups up on the Discord',
		},
		{
			date: new Date('2021/09/28'),
			title: 'DLC releases',
		},
		{
			date: new Date('2021/11/16'),
			title: 'Xen joins',
		},
		{
			date: new Date('2021/12/19'),
			title: 'First New Horizons release',
		},
		{
			date: new Date('2022/01/02'),
			title: 'Idiot (bwc9876) joins',
		},
		{
			date: new Date('2022/01/10'),
			title: 'Migration to separate Modding Discord server',
		},
		{
			date: new Date('2023/01/14'),
			title: 'First Mod Jam Begins',
		},
		{
			date: new Date('2023/01/24'),
			title: 'First Mod Jam Ends',
		},
		{
			date: new Date('2023/07/01'),
			title: 'Second Mod Jam Begins',
		},
		{
			date: new Date('2023/07/17'),
			title: 'Second Mod Jam Ends',
		},
		{
			date: new Date(),
			title: 'Present',
		},
		{
			date: new Date(Math.pow(2, 31) * 1000),
			title: 'Heat death of the Universe',
		},
	];

	const firstEvent = events[0];
	const lastEvent = events[events.length - 1];

	const minimumTimestamp = firstEvent.date.valueOf();
	const maximumTimestamp = lastEvent.date.valueOf();
	const PixelsPerMillisecond = 2e-7;
	const timelineWidth = (maximumTimestamp - minimumTimestamp) * PixelsPerMillisecond;
	const timelineMargin = 1000;
	const monthYearMargin = 2;
	let transitionTimeMs = $state(1500);
	let selectedEvent = $state(0);
	let selectedEventImmediate = $state(0);
	let revealedEventImmediate = $state(0);
	let revealedEvent = $state(0);
	let scale = $state(1);
	let previousScale = $state(scale);
	let scrollId = $state(0);

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

	onMount(() => {
		selectEvent(3);
	});

	// Close enough to easeInOut used in CSS.
	const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

	let mods: Mod[] = $state([]);
	let scrollWrapper: HTMLDivElement | undefined = $state();
	let lineElement: HTMLDivElement | undefined = $state();
	const timelineElements: HTMLDivElement[] = $state([]);

	let getPositionInTimeline = $derived(
		(date: Date) =>
			((date.valueOf() - minimumTimestamp) / (maximumTimestamp - minimumTimestamp)) *
				timelineWidth *
				scale +
			timelineMargin
	);
	let getMonthWidth = $derived(
		(date: Date) =>
			getPositionInTimeline(new Date(date.getFullYear(), date.getMonth() + 1, 1)) -
			getPositionInTimeline(date) -
			monthYearMargin * 2
	);
	let getYearWidth = $derived(
		(date: Date) =>
			getPositionInTimeline(new Date(date.getFullYear() + 1, date.getMonth(), 1)) -
			getPositionInTimeline(date) -
			monthYearMargin * 2
	);
	let scrollTo = $derived((eventIndex: number, instant = false) => {
		if (!scrollWrapper) return;

		const timeStart = Date.now();
		const fromScrollY = scrollWrapper.scrollTop;
		const previousEventY = getPositionInTimeline(events[selectedEvent].date);
		const eventY = getPositionInTimeline(events[eventIndex].date);
		const distance = Math.abs(fromScrollY - eventY);
		const distanceFactor = Math.pow(distance, 1 / 3) * 0.1;
		const toScrollY = eventY - scrollWrapper.clientHeight / 2;
		scrollId++;
		const thisScrollId = scrollId;

		if (fromScrollY === toScrollY) {
			return;
		}

		function scroll() {
			if (!scrollWrapper || !lineElement || thisScrollId != scrollId) return;

			const currentTime = Date.now();
			const time = Math.min(1, (currentTime - timeStart) / transitionTimeMs / distanceFactor);
			const easedT = instant ? 1 : easeInOutCubic(time);

			scrollWrapper.scrollTop = easedT * (toScrollY - fromScrollY) + fromScrollY;
			if (eventIndex > revealedEvent || instant) {
				const lineTop = easedT * (eventY - previousEventY) + previousEventY;
				lineElement.style.top = `${lineTop}px`;
				lineElement.style.minHeight = `${lineTop - getPositionInTimeline(firstEvent.date)}px`;
			}

			if (time < 1) requestAnimationFrame(scroll);
			else {
				if (revealedEvent < eventIndex) revealedEvent = eventIndex;
				selectedEvent = eventIndex;
			}
		}

		requestAnimationFrame(scroll);
	});
	let scrollToEvent = $derived((eventIndex: number) => {
		const element = timelineElements[eventIndex];
		if (!element) return;

		scrollTo(eventIndex);
	});
	let selectEvent = $derived((eventIndex: number) => {
		if (eventIndex >= revealedEventImmediate) {
			revealedEventImmediate = eventIndex;
		}
		selectedEventImmediate = eventIndex;
		scrollToEvent(eventIndex);
	});
	let selectPreviousEvent = $derived(() => {
		selectEvent(selectedEventImmediate > 0 ? selectedEventImmediate - 1 : events.length - 1);
	});
	let selectNextEvent = $derived(() => {
		selectEvent(selectedEventImmediate < events.length - 1 ? selectedEventImmediate + 1 : 0);
	});
	run(() => {
		(async () => {
			if (mods.length > 0) return;
			mods = sortBy(await getModList(), 'firstReleaseDate');
		})();
	});
	run(() => {
		if (scale !== previousScale) {
			previousScale = scale;
			scrollTo(selectedEventImmediate, true);
		}
	});
</script>

<div style="--transition-time: {transitionTimeMs}ms;">
	<div class="flex gap-2 mb-20 fixed flex-col z-30">
		<button onclick={selectPreviousEvent} class="link button bg-darker">Previous</button>
		<button onclick={selectNextEvent} class="link button bg-darker">Next</button>
		<span>Transitions: {transitionTimeMs}ms</span>
		<input type="range" min={100} max={3000} bind:value={transitionTimeMs} />
		<span>Scale: {scale}</span>
		<input
			type="range"
			min={0.1}
			max={10}
			bind:value={scale}
			step={0.05}
			onchange={() => scrollTo(selectedEventImmediate)}
		/>
		<span>Selected: {selectedEvent}</span>
		<span>Revealed: {revealedEvent}</span>
		<span>Mods: {mods.length}</span>
	</div>
	<div bind:this={scrollWrapper} class="overflow-auto relative wrapper">
		<div
			class="h-screen flex justify-center w-full gap-4"
			style="min-height: calc({timelineWidth * scale}px + 50vh);"
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
							<span class="sticky top-1/2 m-4 inline-block font-semibold h-0 leading-0">
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
							<span class="sticky top-1/2 m-4 inline-block font-semibold h-0 leading-0">
								{month.toLocaleString('default', { month: 'long' })}
							</span>
						</div>
					</div>
				{/each}
			</div>
			<div class="relative w-96 flex justify-center">
				{#each events as event, index}
					<div
						bind:this={timelineElements[index]}
						class="slow-transition absolute z-20 flex items-center h-0 cursor-pointer"
						class:opacity-0={index > revealedEvent}
						style="top: {getPositionInTimeline(event.date)}px"
						onclick={() => selectEvent(index)}
						onkeyup={() => selectEvent(index)}
					>
						<div class="flex gap-4 m-2 relative items-center">
							<span
								class="bg-white w-6 h-6 rounded-3xl slow-transition"
								class:scale-50={selectedEvent !== index}
							></span>
							<span
								class="absolute text-white slow-transition w-44 leading-none will-change-transform text-xl bg-background p-2 rounded"
								class:left-10={index % 2 === 0}
								class:right-10={index % 2 !== 0}
								class:origin-left={index % 2 === 0}
								class:origin-right={index % 2 !== 0}
								class:text-right={index % 2 !== 0}
								class:opacity-50={selectedEvent !== index}
								class:scale-75={selectedEvent !== index}
							>
								{event.title}
							</span>
						</div>
					</div>
				{/each}
				{#each mods as mod, index}
					<div
						id="mod-{mod.uniqueName}"
						class="slow-transition absolute z-10"
						style="top: {getPositionInTimeline(new Date(mod.firstReleaseDate))}px"
					>
						<div class="flex flex-col m-4 relative opacity-75">
							<span class="bg-background w-2 h-2 rounded-3xl slow-transition scale-75"></span>
							<span
								class="absolute text-white slow-transition w-32 leading-none will-change-transform text-xs opacity-10"
								class:left-5={index % 2 === 0}
								class:right-5={index % 2 !== 0}
								class:origin-left={index % 2 === 0}
								class:origin-right={index % 2 !== 0}
								class:text-right={index % 2 !== 0}
							>
								{mod.name}
							</span>
						</div>
					</div>
				{/each}
				<div
					bind:this={lineElement}
					class="bg-accent w-2 mx-4 rounded absolute timeline-line"
				></div>
			</div>
		</div>
	</div>
</div>

<style>
	.wrapper {
		max-height: calc(100vh - 184px);
	}
	.slow-transition {
		transition-property: transform opacity;
		transition-duration: var(--transition-time);
		transition-timing-function: ease-in-out;
	}
	.timeline-line {
		transform: translate(0, -100%);
	}
	.leading-0 {
		line-height: 0;
	}
</style>
