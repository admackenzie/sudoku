import { CSS_COLOR_NAMES, format, shuffle } from './helpers.js';

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

	const puzzle = createLS(n);
	const cages = selectOps(buildCages(n), puzzle, n);

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

	return { cages: cages, puzzleStr: puzzle };
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
		// Generate cage sized 2 to 4
		const cageSize = Math.floor(Math.random() * 3) + 2;
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
	const isValid = (r, c) =>
		r < 0 || c < 0 || r > n - 1 || c > n - 1 ? false : true;
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
	else if (op === 'seq') {
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

	// Cages must sorted in ascending order for these operations to all work properly
	const add = arr => arr.reduce((a, b) => b + a);
	const sub = arr => arr.reduce((a, b) => b - a);
	const mul = arr => arr.reduce((a, b) => b * a);
	const div = arr => arr.reduce((a, b) => b / a);
	const evn = arr => arr.every(n => n % 2 === 0);
	const odd = arr => arr.every(n => n % 2 !== 0);
	const equ = n => n[0];
	const seq = arr =>
		arr.every((n, i, a) =>
			i === a.length - 1 ? n === a[i - 1] + 1 : n === a[i + 1] - 1
		);

	// Convert cages of indices to cages of puzzle values
	const cages = arr.map(cage => cage.map(n => str[n]));

	// Convert cages of indices to cages of puzzle values as numbers for computation
	const cagesNum = arr.map(cage =>
		cage.map(n => +str[n]).sort((a, b) => a - b)
	);

	const data = [];

	const ops = {
		add: '+',
		sub: '-',
		mul: 'x',
		div: '÷',
		evn: 'Even',
		odd: 'Odd',
		equ: '=',
		seq: 'Seq',
	};

	const colors = [...CSS_COLOR_NAMES];

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
			if (cage.length > 2 && cage.length < 5 && seq(cage)) operations.push(seq);
		}
		// Append equal for for size 1 cages
		else operations.push(equ);

		// Create object of numbers, indices, operation, value, and all possible combos for each cage
		const op = shuffle(operations)[0];
		const cageIdx = cagesNum.indexOf(cage);
		const currentColor = colors[Math.floor(Math.random() * colors.length)];

		data.push({
			anchor: arr[cageIdx].sort((a, b) => a - b)[0],
			cage: cages[cageIdx],
			color: currentColor,
			idx: arr[cageIdx],
			op: ops[`${op.name}`],
			solutions: getSolutions(op(cage), op.name, cage.length, n),
			value: Number.isInteger(op(cage)) && op(cage),
		});

		colors.splice(colors.indexOf(currentColor), 1);
	}

	return data;
};

export { generate };
