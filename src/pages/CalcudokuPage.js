import { useState } from 'react';

// Components
import { Button, Col, Container, Row } from 'react-bootstrap';

// Custom components
import CalcGrid from '../components/calcudoku/CalcGrid';
import CalcModal from '../components/calcudoku/CalcModal';
import Solutions from '../components/calcudoku/Solutions';

// Logic
import { generate } from '../modules/calcudoku.js';

export default function CalcudokuPage() {
	const [size, setSize] = useState('4');
	const [puzzle, setPuzzle] = useState();
	const [solutions, setSolutions] = useState(null);

	// Set the puzzle state to an object with the puzzle string and its cages array
	const handleGeneration = () => setPuzzle(generate(+size));

	// Display solutions element when mouse enters a cage
	const handleSolutions = cageIdx => {
		// FIXME: all the children of the CalcGrid cell element need to have the data-value attribute or they will sometimes pass undefined as the argument to this function. The ternary below prevents errors from this but is there a better solution?
		const solutionArr = cageIdx ? puzzle.cages[cageIdx].solutions : [];
		setSolutions(solutionArr.length > 0 ? solutionArr : null);
	};

	// TODO: onMouseLeave event to make Solutions element disappear

	return (
		<Container>
			<CalcModal generate={handleGeneration} size={size} setSize={setSize} />

			<Container>
				<Row>
					<Col>
						<h1>Calcudoku page</h1>
					</Col>
					<Col>
						<Button size="lg" variant="primary">
							Solve
						</Button>
					</Col>
				</Row>

				<Row>
					{/* Display grid only after puzzle is generated */}
					<Col className="col-9">
						{puzzle && (
							<CalcGrid
								cages={puzzle.cages}
								onMouseEnter={handleSolutions}
								puzzle={puzzle.puzzleStr}
								size={size}
							/>
						)}
					</Col>

					{/* Display solutions on hover */}
					<Col>{solutions && <Solutions solutions={solutions} />}</Col>
				</Row>
			</Container>
		</Container>
	);
}
