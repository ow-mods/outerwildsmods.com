const magnitudeMap = [
	{ value: 1, symbol: '' },
	{ value: 1e3, symbol: 'k' },
	{ value: 1e6, symbol: 'M' },
	{ value: 1e9, symbol: 'G' },
	{ value: 1e12, symbol: 'T' },
	{ value: 1e15, symbol: 'P' },
	{ value: 1e18, symbol: 'E' },
];

const numberFormatRegex = /\.0+$|(\.[0-9]*[1-9])0+$/;

export const formatNumber = (value: number, digits = 1) => {
	const magnitude = magnitudeMap
		.slice()
		.reverse()
		.find(function (item) {
			return value >= item.value;
		});
	return magnitude
		? (value / magnitude.value).toFixed(digits).replace(numberFormatRegex, '$1') + magnitude.symbol
		: '0';
};
