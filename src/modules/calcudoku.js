import {
	BORDER_DEFAULT,
	BORDER_HIGHLIGHT,
	CAGE_SIZE_WEIGHTS,
	CSS_COLOR_NAMES,
} from './globalVariables.js';

import { format, sequence, shuffle, weightedRandom } from './helpers.js';

/* 
This function generates the data needed for a calcudoku puzzle. Calcudoku is a sudoku variant that partitions the puzzle grid into "cages" rather than rows, columns, and boxes. Each cage gives the result of a mathematical operation and what operation was used; the player must then deduce which numbers are possible in the cage. Like sudoku, there will be no number repeats in any row or column, but due to the shapes of the cages multiple possible grid sizes, there are no boxes to help in finding the solution.

This implementation uses addition, subtraction, multiplication, division, and modulo as mathematical operators; cages can also be split by even or odd, single "gimme" cages using the equals sign, and sequences (e.g. [1, 3, 2] are not consecutive but *could* be, so they're called a sequence here). The logic for calculating these operations is in the selectOps function.

The createLS function generates Latin squares of size 4 ≤ n ≤ 9. It should NOT be used to create sudoku puzzles; it does not check for box rule validity and will yield puzzles that are impossible or have multiple solutions by normal sudoku rules. It repurposes the solver's backtracking algorithm but requires orders of magnitude fewer backtracks (less than 100 for 9x9, often 0 for 4x4). The squares' possible digits (1 to n) are shuffled multiple times within a loop; this prevents the tendency of the same number appearing diagonally at [0, 0], [1, 1], [2, 2], etc.

Lastly, buildCages returns the indices necessary to implement the cage structure. It calculates which cardinal directions are possible to build in from a given anchor point and randomly chooses from the available indices 1 to 3 additional times. The function calculates this from a normal array of numbers of 0 to puzzleSize² - 1, but it "imagines" the indices as a 2D array so it will never go out of the puzzle bounds. If the algorithm gets backed into a corner and can't build the cage as intended, it will randomly choose a new anchor point and start again. This behavior often, but not always, yields the size 1 cages. 
*/

// TODO: getSolutions explanation

// ----------------------------------------------------------------
//                          CORE FUNCTION
// ----------------------------------------------------------------

// Generate data for a calcudoku puzzle of size n x n
const generate = n => {
	// console.time('Time');

	const cageIndices = buildCages(n);
	const puzzle = createLS(n);
	const borderData = calcBorderData(cageIndices, n);
	const cages = selectOps(cageIndices, puzzle, n);

	// Final sanity check
	if (!errorCheck(puzzle, cages, n)) {
		console.log('Puzzle generation failed.');
		return false;
	}

	// Create 2D array of indices
	// const indices = [];
	// for (let i = 0; i < n; i++)
	// 	indices.push([...Array(Math.pow(n, 2)).keys()].slice(n * i, n * (i + 1)));

	// console.timeEnd('Time');
	// console.log(format(puzzle, n), indices);
	// console.log(cages);

	return { borderData: borderData, cages: cages, puzzleStr: puzzle };
};

// ----------------------------------------------------------------
//                          HELPER FUNCTIONS
// ----------------------------------------------------------------

// Build random cages for a puzzle of size n x n
const buildCages = n => {
	// Check function argument for errors
	if (!Number.isInteger(n) || n < 4 || n > 9) return false;

	const arr = [...Array(Math.pow(n, 2)).keys()];
	const cages = [];
	let anchor = 0;

	while (arr.filter(Boolean).length > 0) {
		// Generate a cage with a weighted random size of 2, 3, or 4
		const cageSize = weightedRandom([2, 3, 4], CAGE_SIZE_WEIGHTS[n]);
		let cage = [];

		for (let i = 0; i < cageSize; i++) {
			if (!cage.includes(anchor)) cage.push(anchor);

			// Attempt each cardinal direction from the anchor
			for (let attempt of shuffle(getCardinal(anchor, n))) {
				// Successfully find spot to build cage
				if (arr[attempt]) {
					arr.splice(anchor, 1, null);
					anchor = attempt;
					break;
				}
			}

			// Prevent duplicates by changing anchor to random valid number
			if (i === cageSize - 1 && cage.includes(anchor)) {
				arr.splice(anchor, 1, null);
				anchor = shuffle(arr.filter(Boolean))[0];
			}
		}

		// Reset for next cage
		cages.push(cage);
		cage = [];
	}

	// Test to ensure all indices have been included
	return cages.flat().length === Math.pow(n, 2) &&
		[...Array(Math.pow(n, 2)).keys()].every(v => cages.flat().includes(v))
		? cages
		: false;
};

// ----------------------------------------------------------------

// Calculate border data for each puzzle cell for proper cage highlighting. Takes the array of cage index arrays and the puzzle size as arguments
const calcBorderData = (arr, n) => {
	// Convert the global box shadow variable into one side's border by assigning the spread value to the side's corresponding x/y value
	const configureBorder = (side, shadow = BORDER_HIGHLIGHT) => {
		let [inset, offsetX, offsetY, blur, spread, color] = shadow.split(' ');

		if (side === 'top') offsetY = spread;
		else if (side === 'right') offsetX = `-${parseInt(spread)}px`;
		else if (side === 'bottom') offsetY = `-${parseInt(spread)}px`;
		else if (side === 'left') offsetX = spread;

		return [inset, offsetX, offsetY, blur, 0, color].join(' ');
	};

	const borderData = {};

	// Create an object for each cell in the puzzle. Key: cell index, value: string of four box shadows comprising the cell's border
	for (let i = 0; i < Math.pow(n, 2); i++) {
		// Isolate cage that includes current loop index
		const cage = arr
			.filter(a => a.includes(i))
			.flat()
			.sort((a, b) => a - b);

		// Object with fully highlighted borders from which unneeded borders will be subtracted
		const template = {
			top: configureBorder('top'),
			right: configureBorder('right'),
			bottom: configureBorder('bottom'),
			left: configureBorder('left'),
		};

		let omitted = [];

		// Omit borders along grid border
		if (i < n) omitted.push('top');
		if ((i + 1) % n === 0) omitted.push('right');
		if (i >= Math.pow(n, 2) - n) omitted.push('bottom');
		if (i % n === 0) omitted.push('left');

		// Omit borders between cells in the same cage
		if (cage.length === 2) {
			i === cage[0]
				? omitted.push(cage[1] - cage[0] === 1 ? 'right' : 'bottom')
				: omitted.push(cage[1] - cage[0] === 1 ? 'left' : 'top');
		} else {
			if (cage.includes(i - n)) omitted.push('top');
			if (cage.includes(i + 1)) omitted.push('right');
			if (cage.includes(i + n)) omitted.push('bottom');
			if (cage.includes(i - 1)) omitted.push('left');
		}

		// Convert all omitted borders to the default
		omitted.forEach(side => {
			template[side] = BORDER_DEFAULT;
		});

		// Concatenate all four box shadows into one string
		borderData[i] = Object.values(template).join(', ');

		omitted = [];
	}

	borderData['borderDefault'] = BORDER_DEFAULT;

	return borderData;
};

// ----------------------------------------------------------------

// Generate a Latin square of size n x n
const createLS = n => {
	// Check function argument for errors and puzzles outside the accepted range
	if (!Number.isInteger(n) || n < 4 || n > 9) {
		console.log('Puzzle size must be an integer between 4 and 9, inclusive.');
		return false;
	}

	const backtrack = arr => {
		for (let row = 0; row < n; row++) {
			// Randomize array of numbers from 1 to n
			const digits = shuffle([...Array(n).keys()].map(n => (n + 1).toString()));

			for (let col = 0; col < n; col++) {
				// Attempt only when cell is "empty"
				if (arr[row][col] === '0') {
					for (let attempt of digits) {
						// Attempt using only valid numbers
						if (isValidLS(arr, row, col, attempt, n)) {
							arr[row][col] = attempt;

							// Recursively test valid numbers
							if (backtrack(arr)) {
								return true;
							}

							// Reset cell when attempt fails
							else arr[row][col] = '0';
						}
					}

					// Attempt failed
					return false;
				}
			}
		}

		// Successfully reached the end of the grid
		square = arr;
		return true;
	};

	// Create starting array of '0's
	const arr = format('0'.repeat(Math.pow(n, 2)), n);
	let square = [];

	backtrack(arr);

	// Return square formatted as a string
	return square.flat().join('');
};

// ----------------------------------------------------------------

// Prevent invalid puzzle strings and cage data arrays from breaking the generator
const errorCheck = (str, arr, n) => {
	try {
		format(str, n);
	} catch (TypeError) {
		return false;
	}

	arr.forEach(obj => {
		if (obj.cage.includes(undefined)) return false;
	});
	return true;
};

// ----------------------------------------------------------------

// Return valid cardinal indices for v from a 2D array of size n x n
const getCardinal = (v, n) => {
	// Prevent generation outside the boundaries of the grid
	const isValid = (r, c) => r >= 0 && c >= 0 && r <= n - 1 && c <= n - 1;

	const r = Math.floor(v / n);
	const c = v % n;
	const valid = [];

	// N → E → S → W
	if (isValid(r - 1, c)) valid.push(n * (r - 1) + c);
	if (isValid(r, c + 1)) valid.push(n * r + c + 1);
	if (isValid(r + 1, c)) valid.push(n * (r + 1) + c);
	if (isValid(r, c - 1)) valid.push(n * r + c - 1);

	return valid;
};

// ----------------------------------------------------------------

// For each cage's total value, calculate all possible combinations for that operation within the puzzle parameters
const getSolutions = (val, op, cageSize, puzzleSize) => {
	const solutions = [];

	// Addition and multiplication
	if (['add', 'mul'].includes(op)) {
		const combo = [];

		const calc = (curr, base) => {
			// Filter out arrays with all the same number or more than two duplicates
			if (
				curr === val &&
				combo.length === cageSize &&
				!combo.every(n => n === combo[0]) &&
				!combo.some(n => combo.filter(v => v === n).length > 2)
			)
				solutions.push([...combo]);

			for (let i = base; i <= puzzleSize; i++) {
				const temp = op === 'add' ? curr + i : curr * i;

				// Add number to combo array when valid
				if (temp <= val && combo.length < cageSize) {
					combo.push(i);

					// Run function recursively
					calc(temp, i);

					// Reset combo array
					combo.pop();
				} else return;
			}
		};

		// Initialize calc based on operation
		op === 'add' ? calc(0, 1) : calc(1, 1);

		// Organize output for visual parity
		return solutions
			.map(a => a.sort())
			.map(a => a.join(''))
			.sort()
			.map(a => a.split(''))
			.map(a =>
				op === 'add' ? `${a.join(' + ')} = ${val}` : `${a.join(' x ')} = ${val}`
			);
	}

	// Subtraction and division
	else if (['sub', 'div'].includes(op)) {
		for (let i = puzzleSize; i >= 1; i--) {
			for (let j = 1; j < puzzleSize; j++) {
				if (op === 'sub' && i - j === val) solutions.push([i, j]);
				if (op === 'div' && i / j === val) solutions.push([i, j]);
			}
		}

		// Organize output for visual parity
		return solutions
			.sort((a, b) => a[0] - b[0])
			.map(a =>
				op === 'sub' ? `${a.join(' - ')} = ${val}` : `${a.join(' ÷ ')} = ${val}`
			);
	}

	// Sequence
	else if (op === 'sequence') {
		for (let i = 0; i < puzzleSize - cageSize + 1; i++)
			solutions.push(
				[...Array(puzzleSize).keys()].map(n => n + 1).slice(i, i + cageSize)
			);
		return solutions.map(a => a.join(', '));
	}

	// Equals
	else if (op === 'equ') return [`${val} = ${val}`];

	// Return empty array for all other operations
	return solutions;
};

// ----------------------------------------------------------------

// Test if attempt is a valid solution at LS[row][col] for size n x n
const isValidLS = (arr, row, col, attempt, n) => {
	for (let i = 0; i < n; i++) {
		// Check if attempt is in row or column
		if ([arr[row][i], arr[i][col]].includes(attempt)) return false;
	}
	return true;
};

// ----------------------------------------------------------------

// Choose mathematical operations for an array of cages, puzzle string, and puzzle size
const selectOps = (arr, str, n) => {
	// Check function argument for errors
	if (!arr || !str) return false;

	// Possible mathematical operations to be performed on a cage. This list also includes the sequence function, imported from the helpers.js module. The cages must sorted in ascending order for these operations to all work properly
	const add = arr => arr.reduce((a, b) => b + a);
	const sub = arr => arr.reduce((a, b) => b - a);
	const mul = arr => arr.reduce((a, b) => b * a);
	const div = arr => arr.reduce((a, b) => b / a);
	const evn = arr => arr.every(v => v % 2 === 0);
	const odd = arr => arr.every(v => v % 2 !== 0);
	const equ = v => v[0];

	// Convert cages of indices to cages of puzzle values
	const cages = arr.map(cage => cage.map(n => str[n]));

	// Convert cages of indices to cages of puzzle values as numbers for computation
	const cagesNum = arr.map(cage =>
		cage.map(n => +str[n]).sort((a, b) => a - b)
	);

	const opSymbol = {
		add: '+',
		sub: '-',
		mul: 'x',
		div: '÷',
		evn: 'Even',
		odd: 'Odd',
		equ: '=',
		sequence: 'Seq',
	};

	const colors = [...CSS_COLOR_NAMES];

	// Apply special designation to size 3 and 4 cages that will appear as straight lines on the grid. They have special requirements for eliminating impossible solutions.
	// const straightCages = [];
	// arr
	// 	.filter(cage => cage.length > 2)
	// 	.map(cage => cage.sort((a, b) => a - b))
	// 	.forEach(cage => {
	// 		// Test for horizontal and vertical straight cages
	// 		if (seq(cage) || seq(cage, n)) straightCages.push(cage);
	// 	});

	const data = [];

	// Determine valid operations for each cage
	for (let cage of cagesNum) {
		const operations = [];

		// Append even/odd for all cages
		if (evn(cage)) operations.push(evn);
		if (odd(cage)) operations.push(odd);

		if (cage.length > 1) {
			// TODO: implement inequality in >1

			// Append subtraction, division, and modulo for size 2 cages
			if (cage.length === 2) {
				operations.push(sub);

				if (cage[1] % cage[0] === 0) operations.push(div);
			}

			// Append addition and multiplication for size 2, 3, and 4 cages
			if (cage.length < 5) operations.push(add, mul);

			// FIXME: maybe sequence could work in >4 cages?
			// Append sequence for size 3 and 4 cages
			if (cage.length > 2 && cage.length < 5 && sequence(cage))
				operations.push(sequence);
		}
		// Append equal for for size 1 cages
		else operations.push(equ);

		// Create object of numbers, indices, operation, value, and all possible combos for each cage
		const op = shuffle(operations)[0];
		const cageIdx = cagesNum.indexOf(cage);
		const currentColor = colors[Math.floor(Math.random() * colors.length)];
		const solutions = getSolutions(op(cage), op.name, cage.length, n);

		data.push({
			anchor: arr[cageIdx].sort((a, b) => a - b)[0],
			cage: cages[cageIdx],
			color: currentColor,
			idx: arr[cageIdx],
			lockable: solutions.length > 1,
			op: opSymbol[`${op.name}`],
			solutions: solutions,
			// straight: straightCages.includes(arr[cageIdx]),
			value: Number.isInteger(op(cage)) && op(cage),
		});

		colors.splice(colors.indexOf(currentColor), 1);
	}

	return data;
};

export { generate };
