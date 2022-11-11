import { useState } from 'react';

// Styles
import classes from '../../calcudoku.module.css';

// Components
import { Container, Stack } from 'react-bootstrap';

export default function Solutions({ ...props }) {
	const { cageIdx, cellIdx, invalidSolutions, lockedSolution, straight } =
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

	const invalidRowIdx =
		invalidSolutions[`row${Math.floor(cellIdx / props.size)}`];
	const invalidColIdx = invalidSolutions[`col${cellIdx % props.size}`];

	/* 
		When solutions should be invalid:
		- 
	*/

	const invalid = i => {
		// Create array of only the single digit numbers in the solution
		const digits = solutions[i].split(' ').filter(v => /\b\d\b/.test(v));

		// if (invalidRowIdx) {
		// 	return invalidRowIdx.some(v => solutions[i].split(' ').includes(v));
		// }
		// if (invalidColIdx) {
		// 	return invalidColIdx.some(v => solutions[i].split(' ').includes(v));
		// }

		// Straight cages cannot have duplicate numbers in their solutions
		return straight && digits.length !== new Set(digits).size;
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
