// Convert a string of size n² to a 2D array of size n x n
const format = (str, n) =>
	str.match(new RegExp(`.{${n}}`, 'g')).map(s => s.split(''));

// Test if an array of numbers is an arithmetic sequence with an optional argument to specify the common difference
const sequence = (arr, difference = 1) =>
	arr
		.slice(1)
		.map((v, i) => v - arr[i])
		.every(v => v === difference);

// Shuffle array by swapping each value with a random one before it
// https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
const shuffle = arr => {
	for (let i = arr.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));

		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
};

// Determine if a superset array contains all the values, including duplicates, of a subset array
const subset = (subset, superset) => {
	const frequency = new Map();

	// Count all occurrences of each value in the subset
	subset.forEach(v => frequency.set(v, (frequency.get(v) ?? 0) + 1));

	// Subtract every occurrence in the superset from each value's count
	superset.forEach(
		v => frequency.has(v) && frequency.set(v, frequency.get(v) - 1)
	);

	return [...frequency.values()].every(count => count <= 0);
};

// Calculate a weighted random value from an array of outcomes and an array of weights, ordered to match. Omitting the weights argument returns a true random outcome
const weightedRandom = (outcomes, weights = [...outcomes].fill(1)) => {
	const cumulativeWeights = weights.map((v, i, arr) =>
		arr.slice(0, i).reduce((a, b) => a + b, v)
	);
	const random = Math.floor(Math.random() * Math.max(...cumulativeWeights));

	return outcomes[cumulativeWeights.findIndex(v => v > random)];
};

export { format, sequence, shuffle, subset, weightedRandom };
