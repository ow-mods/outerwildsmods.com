import type { RequestHandler } from '@sveltejs/kit';

type StarData = {
	x: number;
	y: number;
	opacity: number;
	radius: number;
	id: number;
};

export type StarDataResponse = {
	starData1: StarData[];
	starData2: StarData[];
	width: number;
	height: number;
};

const width = 2000;
const height = 150;
const starCount = 80;

const round = (value: number, magnitude: number) => Math.round(value * magnitude) / magnitude;

const random = (min: number, max: number, roundMagnitude: number) =>
	round(Math.random() * (max - min) + min, roundMagnitude);

export const GET: RequestHandler = async () => {
	const starData1: StarData[] = [];
	const starData2: StarData[] = [];

	for (let i = 0; i < starCount; i++) {
		starData1.push({
			x: random(0, width, 1),
			y: random(0, height, 1),
			opacity: random(0.1, 0.8, 10),
			radius: random(0.1, 1.2, 10),
			id: i
		});
		starData2.push({
			x: random(0, width, 1),
			y: random(0, height, 1),
			opacity: random(0.1, 0.8, 10),
			radius: random(0.1, 1.2, 10),
			id: i
		});
	}

	const starDataResponse: StarDataResponse = {
		starData1,
		starData2,
		width,
		height
	};

	return new Response(JSON.stringify(starDataResponse));
};

export const prerender = true;
