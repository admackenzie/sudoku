import { useState } from 'react';

// Components
import { Button, Col, Container, Row } from 'react-bootstrap';

// Custom components
import SudGrid from '../components/sudoku/SudGrid';
import SudModal from '../components/sudoku/SudModal';

// Logic
import { easy, intermediate, hard, expert } from '../modules/puzzles';
import { createSymmetry } from '../modules/symmetry.js';

export default function SudokuPage() {
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
			{/* Puzzle generation screen */}
			<SudModal
				difficulty={difficulty}
				generate={handleGeneration}
				setDifficulty={setDifficulty}
			/>

			{/* Puzzle grid */}
			<Container>
				<Row>
					<Col>
						<h1>Sudoku page</h1>
					</Col>
					<Col>
						<Button size="lg" variant="primary">
							Solve
						</Button>
					</Col>
				</Row>

				<Row>
					{/* Display grid only after puzzle is generated */}
					<Col className="col-9">{puzzle && <SudGrid puzzle={puzzle} />}</Col>
				</Row>
			</Container>
		</Container>
	);
}
