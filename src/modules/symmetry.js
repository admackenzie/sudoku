import { format, shuffle } from './helpers.js';
import { easy, intermediate, hard, expert } from './puzzles.js';

/* 
There are six operations you can apply to every valid sudoku that will transform it to a new, distinct, valid puzzle. These are: swapping the bands (groups of three rows), swapping the rows within the bands, swapping the stacks (groups of three columns), swapping the columns within the stacks, relabeling (e.g., all 1s become 7s, all 2s become 4s, etc.), and some form of puzzle flipping. In this case, flipping means reflection, transposition, or rotation; however, when used in combination with the other operations, only one flipping method will yield a unique output. This function uses a quarter-turn rotation for that purpose. 

These operations in tandem produce many viable symmetries from each seed. The total number of permutations is 3!⁸ (swapping) * 9! (relabeling) * 2 (rotation), or ~1.2 trillion isomorphic puzzles. Since the user will only ever experience a very small fraction of those, in this function I want to prioritize visual contrast among the generated puzzles. To that end, each symmetry will always be relabeled and perform at least one of the remaining five operations. This reduces the total number of possible symmetries but can be balanced by generating puzzles from multiple seeds.
*/

// ----------------------------------------------------------------
//                          CORE FUNCTION
// ----------------------------------------------------------------

// Randomly apply 1 to 5 symmetry operations (and relabel) to generate a new puzzle
const createSymmetry = str => {
	// Randomize possible symmetries
	const symmetries = shuffle([rotate, swapBand, swapCol, swapRow, swapStack]);
	const data = [];
	let newPuzzle = format(str, 9);

	// Number of symmetries to apply
	const n = Math.floor(Math.random() * 5) + 1;

	for (let i = 0; i < n; i++) {
		newPuzzle = symmetries[i](newPuzzle);
		data.push(symmetries[i].name);
	}

	// Always relabel numbers
	newPuzzle = relabel(newPuzzle);
	data.push('relabel');

	// Display results in the console
	console.log(symmetryResults(data, str));
	console.log('Original:', format(str, 9));
	console.log('New:', newPuzzle);

	// Return puzzle formatted as a string
	return newPuzzle.flat().join('');
};

// ----------------------------------------------------------------
// 						SYMMETRY OPERATIONS
// ----------------------------------------------------------------

// Randomly swap seed numbers (9! permutations)
const relabel = arr => {
	const digits = shuffle(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
	const labels = {};

	// Map random digit to keys 1-9
	digits.forEach((key, i) => (labels[i + 1] = key));

	// Change numbers if key exists or default to '0'
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			arr[row][col] = labels[arr[row][col]] || '0';
		}
	}
	return arr;
};

// Rotates puzzle 90° to the right (e.g., [0, 0] becomes [0, 8])
const rotate = arr => {
	// Temporary 2D array to reposition cells
	let temp = '0'
		.repeat(81)
		.match(/.{9}/g)
		.map(s => s.split(''));

	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			let cell = arr[row][col];
			let newCol = 9 - (row + 1);

			// Col becomes row position and and an adjusted row becomes the col
			temp[col][newCol] = cell;
		}
	}
	return temp;
};

// Randomly swap bands (3! permutations)
const swapBand = arr =>
	shuffle([arr.slice(0, 3), arr.slice(3, 6), arr.slice(6)]).flat();

// Randomly swap columns within a stack (3!³ permutations)
const swapCol = arr => {
	arr = rotate(arr);
	arr = swapRow(arr);
	for (let i = 0; i < 3; i++) arr = rotate(arr);
	return arr;
};

// Randomly swap rows within a band (3!³ permutations)
const swapRow = arr =>
	[
		shuffle(arr.slice(0, 3)),
		shuffle(arr.slice(3, 6)),
		shuffle(arr.slice(6)),
	].flat();

// Randomly swap stacks (3! permutations)
const swapStack = arr => {
	arr = rotate(arr);
	arr = swapBand(arr);
	for (let i = 0; i < 3; i++) arr = rotate(arr);
	return arr;
};

// ----------------------------------------------------------------
//                          HELPER FUNCTIONS
// ----------------------------------------------------------------

// Format an output string listing which symmetry operations were applied
const symmetryResults = (data, str) => {
	const actions = {
		relabel: 'relabeled',
		rotate: 'rotated',
		swapBand: 'band swapped',
		swapCol: 'column swapped',
		swapRow: 'row swapped',
		swapStack: 'stack swapped',
	};
	const difficulty = [easy, intermediate, hard, expert];
	let idx;

	// Determine puzzle index
	for (let level of difficulty) {
		if (level.includes(str))
			idx = `${
				['Easy', 'Intermediate', 'Hard', 'Expert'][difficulty.indexOf(level)]
			} ${level.indexOf(str)}`;
	}

	data = data.map(s => actions[s]);

	let result = `The seed puzzle (${idx}) was `;

	// Make output grammatically correct
	if (data.length > 0) {
		for (let s of data.sort()) {
			if (data.length === 1) result += `${s}.`;
			else if (data.length === 2) {
				result += `${data[0]} and ${data[1]}.`;
				break;
			} else {
				data.indexOf(s) === data.length - 1
					? (result += `and ${s}.`)
					: (result += `${s}, `);
			}
		}
	} else result += 'not altered.';

	return result;
};

export { createSymmetry };
