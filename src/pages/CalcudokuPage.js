import { useState } from 'react';

import CalcudokuOptionsModal from '../components/calcudoku/CalcudokuOptionsModal';
import Grid from '../components/Grid';

import { Col, Container, Row } from 'react-bootstrap';

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
		<Container>
			<CalcudokuOptionsModal
				generate={handleGeneration}
				size={size}
				setSize={setSize}
			/>

			<Container>
				<Row>
					<h1>Calcudoku page</h1>
				</Row>

				<Row>
					{/* Display grid only after puzzle is generated */}
					<Col className="col-8">
						{puzzle && <Grid puzzle={puzzle.puzzleStr} size={size} />}
					</Col>
				</Row>
			</Container>
		</Container>
	);
}
