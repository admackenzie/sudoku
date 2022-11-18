import { useState } from 'react';

// Styles
import classes from '../../calcudoku.module.css';

// Components
import { Container, Stack } from 'react-bootstrap';

// Logic
import { sequence, subset } from '../../modules/helpers.js';

export default function Solutions({ ...props }) {
	// console.log(props.solutionsData);

	const { cageIdx, cageIdxArr, cellIdx, invalidSolutions, lockedSolution } =
		props.solutionsData;

	// Prioritize displaying the locked solution if it exists, else the full solutions array
	const solutions = lockedSolution
		? lockedSolution
		: props.solutionsData.solutions;

	// Create an object with a key : value structure of cage indices : arrays containing the eliminated solutions
	const [eliminatedSolutions, setEliminatedSolutions] = useState({});
	const handleEliminateSolution = (e, idx) => {
		// Solution to be eliminated
		const solution = solutions[idx];

		// Create array for key cageIdx if one does not exist
		const arr = eliminatedSolutions[cageIdx]
			? eliminatedSolutions[cageIdx]
			: [];

		const temp = { ...eliminatedSolutions };

		// Remove the solution if it's in the array, else add it
		arr.includes(solution)
			? arr.splice(arr.indexOf(solution), 1)
			: arr.push(solution);

		// Create or update key : value pair
		temp[cageIdx] = arr;

		setEliminatedSolutions(temp);

		// Prevent default context menu on right click
		e.preventDefault();
	};

	const eliminated = i =>
		eliminatedSolutions[cageIdx] &&
		eliminatedSolutions[cageIdx].includes(solutions[i]);

	// ----------------------------------------------------------------

	/* 
		Invalid() function: takes solution index as argument, returns boolean
			const currentSolution = solutions[i] = 'CS'

			✓ Test for straight property
			✓ Check all eliminated answers in the cage. If all cells lack a number, it's invalid. If that number is in CS, return true
			✓ Check for answers in the row and col outside the cage. If all cage cells are in a row or col with a number, that number is invalid. If that number is in CS, return true
			✓ If an answer is submitted inside the cage and CS does NOT contain that number, return true

			- If a number fulfills any combination of the above in all cage cells, that number is invalid. If that number is in CS, return true
		
			 

			else return false
		
		Notes:
			- Instead of working around rows and columns in the invalidSolutions object, try isolating the cell indices of all cells outside the cage in each row and col. Use answer[cellIdx] for those cells to see what numbers are invalid
			
			const n = props.size

			cageIdxArr.forEach(i => {
				const row = Math.floor(i / n)
				const rowIdx = [...Array(n).keys()].map(v => row * n + v).filter(v => v !== i) 

				const col = i % n
				const colIdx = [...Array(n).keys()].map(v => v * n + col).filter(v => v !== i) 
			})
			
	*/
	// FIXME: this is not working as intended
	const invalid = i => {
		const n = +props.size;

		// Create array of only the single digit terms in the solution equation
		const terms = solutions[i]
			.split('=')[0]
			.split(' ')
			.filter(v => /\b\d\b/.test(v));

		// Sort array of cage indices in ascending order
		const sorted = cageIdxArr.sort((a, b) => a - b);

		// Remove solutions in straight cages (horizontal or vertical line) with two of the same term
		const straight =
			cageIdxArr.length > 2 && (sequence(sorted) || sequence(sorted, n));
		if (straight && terms.length !== new Set(terms).size) return true;

		// Remove solutions that are two pairs of numbers unless in square cage
		const square = sequence(sorted.slice(0, 2)) && sequence(sorted.slice(2));
		if (cageIdxArr.length === 4 && !square && new Set(terms).size === 2)
			return true;

		// Test if answer values are single digits from 1 to puzzle size
		const re = new RegExp(`\\b[1-${n}]\\b`);

		// Count data for invalid numbers in cages
		const count = new Map();
		const incrementCount = (map, key) =>
			map.set(key, (count.get(key) ?? 0) + 1);

		cageIdxArr.forEach(cell => {
			// List all other cells in a cell's row
			const row = [...Array(n).keys()]
				.map(v => Math.floor(cell / n) * n + v)
				.filter(v => v !== cell);

			// List all other cells in a cell's column
			const col = [...Array(n).keys()]
				.map(v => v * n + (cell % n))
				.filter(v => v !== cell);

			// Test for numbers eliminated by right click
			(props.eliminatedNumbers[cell] ?? []).forEach(num =>
				incrementCount(count, num.toString())
			);

			// Test for numbers eliminated by being elsewhere in the row or column
			row.forEach(idx => {
				const v = props.answer[idx];
				re.test(v) && incrementCount(count, v);
			});

			col.forEach(idx => {
				const v = props.answer[idx];
				re.test(v) && incrementCount(count, v);
			});
		});

		const testCount = () => {
			let invalid = false;

			terms.forEach(term => {
				if ((count.get(term) ?? 0) > terms.filter(v => v === term).length)
					invalid = true;
			});

			return invalid;
		};

		// Remove solution if a term's invalid count exceeds its frequency in a cage
		if (testCount()) return true;

		// Remove solution if it does not contain every answer submitted to the cage
		if (
			!subset(
				cageIdxArr.map(v => props.answer[v]).filter(v => re.test(v)),
				terms
			)
		)
			return true;

		return false;
	};

	return (
		// Prevent rendering of empty solutions container
		solutions.length > 0 && (
			<Container className="border border-dark border-1 fs-4 py-3">
				<Stack className="text-center">
					{[...Array(solutions.length).keys()].map(n => {
						return (
							<div
								className={`${
									invalid(n)
										? classes.invalidSolution
										: eliminated(n)
										? classes.eliminatedSolution
										: classes.possibleSolution
								}`}
								key={n}
								onContextMenu={e => handleEliminateSolution(e, n)}
							>
								{solutions[n]}
							</div>
						);
					})}
				</Stack>
			</Container>
		)
	);
}
