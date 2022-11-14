// Convert puzzle string to a 2D array of size n x n
const format = (str, n) =>
	str.match(new RegExp(`.{${n}}`, 'g')).map(s => s.split(''));

// Shuffle array by swapping each value with a random one before it
// https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
const shuffle = arr => {
	for (let i = arr.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));

		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
};

// Calculate a weighted random value from an array of outcomes and an array of weights, ordered to match. Omitting the weights argument returns a true random outcome
const weightedRandom = (outcomes, weights = [...outcomes].fill(1)) => {
	const cumulativeWeights = weights.map((v, i, arr) =>
		arr.slice(0, i).reduce((a, b) => a + b, v)
	);
	const random = Math.floor(Math.random() * Math.max(...cumulativeWeights));

	return outcomes[cumulativeWeights.findIndex(v => v > random)];
};

export { format, shuffle, weightedRandom };
