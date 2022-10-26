import { useState } from 'react';

import SudokuOptionsModal from '../components/sudoku/SudokuOptionsModal';
import Grid from '../components/Grid';

// Logic functions
import { easy, intermediate, hard, expert } from '../modules/puzzles';
import { createSymmetry } from '../modules/symmetry.js';
import { Col, Container, Row } from 'react-bootstrap';

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

	console.log(puzzle);
	return (
		<Container>
			<SudokuOptionsModal
				difficulty={difficulty}
				generate={handleGeneration}
				setDifficulty={setDifficulty}
			/>

			<Container>
				<Row>
					<h1>Sudoku page</h1>
				</Row>

				<Row>
					{/* Display grid only after puzzle is generated */}
					<Col className="col-8">{puzzle && <Grid puzzle={puzzle} />}</Col>
				</Row>
			</Container>
		</Container>
	);
}
