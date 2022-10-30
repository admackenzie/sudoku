import { format } from './helpers.js';

/* 
This function uses a brute force backtracking algorithm to solve a given sudoku. Brute force is the "dumbest" approach to solving these puzzles and when done improperly can be very slow and/or resource intensive. This implementation, however,can solve each of the world's ten hardest sudoku (according to mathematician Arto Inkala) in under 100 ms, even when the solution requires hundreds of thousands of backtracks. A test array of one million difficult symmetries (30 ± 5 givens) yielded an average of 1.3 ms per puzzle. 
*/

// ----------------------------------------------------------------
//                          CORE FUNCTION
// ----------------------------------------------------------------

// Solve using backtracking. Accepts a string as the input
const solve = str => {
	console.time('Time');

	let backtracks = 0;
	let solution = [];

	const backtrack = arr => {
		// Valid values for the puzzle (1 - 9, inclusive)
		const digits = [...Array(9).keys()].map(n => (n + 1).toString());

		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				// Attempt only when cell is "empty"
				if (arr[row][col] === '0') {
					for (let attempt of digits) {
						// Attempt using only valid numbers
						if (isValid(arr, row, col, attempt)) {
							arr[row][col] = attempt;

							// Recursively test valid numbers
							if (backtrack(arr)) {
								return true;
							}

							// Reset cell when attempt fails
							else {
								arr[row][col] = '0';
								backtracks++;
							}
						}
					}

					// Attempt failed
					return false;
				}
			}
		}

		// Successfully reached the end of the grid
		solution = arr;
		return true;
	};

	if (errorCheck(str)) backtrack(format(str, 9));

	// Final sanity check for impossible puzzles
	if (solution.every(row => !row.includes('0')) && solution.length > 0) {
		console.timeEnd('Time');
		console.log('Backtracks:', backtracks);
		// console.log('Puzzle:', format(str, 9));
		console.log('Solution:', solution);

		// Return solution formatted as a string
		return solution.flat().join('');
	} else {
		console.log(`${backtracks} backtracks attempted. Puzzle is not solvable.`);
		return false;
	}
};

// ----------------------------------------------------------------
//                          HELPER FUNCTIONS
// ----------------------------------------------------------------

// Prevent invalid puzzles from breaking the solver
const errorCheck = str => {
	// Test for malformed strings
	try {
		format(str, 9);
	} catch (TypeError) {
		console.log('Invalid puzzle string.');
		return false;
	}

	// Test puzzle length
	if (str.length !== 81) {
		console.log('Puzzle strings must be 81 characters.');
		return false;
	}

	// Test whether the string contains at least one '0'
	if (!/0/.test(str)) {
		console.log('Puzzle must contain at least one empty cell.');
		return false;
	}

	// Test whether puzzle has 17 or more givens
	if ([...str].filter(s => s !== '0').length < 17) {
		console.log('Puzzle must contain at least 17 given numbers.');
		return false;
	}

	// Test rows and cols for duplicate numbers
	for (let i = 0; i < 9; i++) {
		const row = format(str, 9)[i].filter(n => n !== '0');
		const col = format(str, 9)
			.map(c => c[i])
			.filter(n => n !== '0');

		if (
			row.length !== [...new Set(row)].length ||
			col.length !== [...new Set(col)].length
		) {
			console.log('At least one row or column contains duplicate numbers.');
			return false;
		}
	}
	return true;
};

// Test if v is a valid solution at puzzle[row][col]
const isValid = (arr, row, col, v) => {
	for (let i = 0; i < 9; i++) {
		// Coordinates for the box containing the test cell
		const boxR = 3 * Math.floor(row / 3) + Math.floor(i / 3);
		const boxC = 3 * Math.floor(col / 3) + (i % 3);

		// Check if n is in row, column, or box
		if ([arr[row][i], arr[i][col], arr[boxR][boxC]].includes(v)) return false;
	}
	return true;
};

// Calculate the time to mass solve an array of puzzle strings
// const speedTest = arr => {
// 	console.time('Total time');

// 	for (let p of arr) {
// 		if (!solve(p))
// 			console.log(`IMPOSSIBLE PUZZLE FOUND AT INDEX ${arr.indexOf(p)}`);
// 		console.log('\n');
// 	}

// 	console.log('Total puzzles:', arr.length);
// 	console.timeEnd('Total time');
// };

export { solve };
