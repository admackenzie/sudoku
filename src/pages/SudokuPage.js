import { useState } from 'react';

import SudokuOptionsModal from '../components/sudoku/SudokuOptionsModal';

// Logic functions
import { easy, intermediate, hard, expert } from '../modules/puzzles';
import { createSymmetry } from '../modules/symmetry.js';

export default function SudokuPage(props) {
	const [difficulty, setDifficulty] = useState('0');
	const [puzzle, setPuzzle] = useState();

	// Choose random puzzle from the selected difficulty, create a symmetry, and set the resulting string as the puzzle state
	const handleGeneration = () => {
		const diffArr = [easy, intermediate, hard, expert][difficulty];

		setPuzzle(
			createSymmetry(diffArr[Math.floor(Math.random() * diffArr.length)])
		);
	};

	return (
		<div>
			<SudokuOptionsModal
				difficulty={difficulty}
				handleGeneration={handleGeneration}
				setDifficulty={setDifficulty}
			/>
			<h1>Sudoku page</h1>
		</div>
	);
}
