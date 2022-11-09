import { useState } from 'react';

// Styles
import classes from '../../calcudoku.module.css';

// Components
import { Container, Stack } from 'react-bootstrap';

export default function Solutions({ ...props }) {
	// Prioritize displaying the locked solution if it exists, else the full solutions array
	const solutions = props.solutionsData.lockedSolution
		? props.solutionsData.lockedSolution
		: props.solutionsData.solutions;

	const cageIdx = props.solutionsData.cageIdx;

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

	return (
		// Prevent rendering of empty solutions container
		solutions.length > 0 && (
			<Container className="border border-dark border-1 fs-4 py-3">
				<Stack className="text-center">
					{[...Array(solutions.length).keys()].map(n => {
						return (
							<div
								className={`${
									eliminated(n)
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
