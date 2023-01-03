import { stringToNumber } from './string-to-number';

export const getHueFromText = (text: string): string =>
	`filter: hue-rotate(${stringToNumber(text) % 360}deg);`;
