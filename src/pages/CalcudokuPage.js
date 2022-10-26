import { useState } from 'react';

import CalcudokuOptionsModal from '../components/calcudoku/CalcudokuOptionsModal';

// Logic functions
import { generate } from '../modules/calcudoku.js';

export default function CalcudokuPage(props) {
	const [size, setSize] = useState('4');
	const [puzzle, setPuzzle] = useState();

	// Set the puzzle state to an object with the puzzle string and its cages array
	const handleGeneration = () => setPuzzle(generate(+size));

	console.log(puzzle && puzzle.puzzleStr);
	console.log(puzzle && puzzle.cages);

	return (
		<div>
			<CalcudokuOptionsModal
				handleGeneration={handleGeneration}
				size={size}
				// handleGeneration={handleGeneration}
				setSize={setSize}
			/>
			<h1>Calcudoku page</h1>
		</div>
	);
}
