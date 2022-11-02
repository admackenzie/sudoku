import { useEffect, useState } from 'react';

// Components
import { Col, Container, Row } from 'react-bootstrap';

// Custom components
import SudGrid from '../components/sudoku/SudGrid';
import SudModal from '../components/sudoku/SudModal';
import SidePanel from '../components/sudoku/SidePanel';

// Logic
import { easy, intermediate, hard, expert } from '../modules/puzzles';
import { solve } from '../modules/solve';
import { createSymmetry } from '../modules/symmetry';

export default function SudokuPage() {
	const [difficulty, setDifficulty] = useState('0');
	const [puzzle, setPuzzle] = useState();
	const [answer, setAnswer] = useState();
	const [puzzleSolution, setPuzzleSolution] = useState();

	// Choose random puzzle from the selected difficulty, create a symmetry, and set the resulting string as the puzzle state
	const handleGeneration = () => {
		const diffArr = [easy, intermediate, hard, expert][difficulty];
		const newPuzzle = createSymmetry(
			diffArr[Math.floor(Math.random() * diffArr.length)]
		);

		setPuzzle(newPuzzle);
		setAnswer(newPuzzle.split(''));
		setPuzzleSolution(solve(newPuzzle));

		// Set focused cell to first cell without a given number
		// setFocusedCell(newPuzzle.search(/0/));
	};

	// Modify answer array
	const handleAnswer = (val, cellIdx) => {
		const temp = [...answer];
		temp.splice(cellIdx, 1, val);

		setAnswer(temp);
	};

	// Focus state for answer input via number buttons
	const [focusedCell, setFocusedCell] = useState();
	const handleFocus = e => setFocusedCell(e);

	// TODO: test state to see if user inputted answers are correct solution -- useEffect?
	const [solved, setSolved] = useState(false);
	const handleSolve = () => {
		setSolved(true);
		setAnswer(puzzleSolution.split(''));

		if (answer && answer.join('') === puzzleSolution) handleSolve();
	};

	return (
		<Container>
			{/* Puzzle generation screen */}
			<SudModal
				difficulty={difficulty}
				generate={handleGeneration}
				setDifficulty={setDifficulty}
			/>

			{/* Page content loaded when puzzle is generated */}
			{puzzle && (
				<Row className="mt-5">
					<Col className="col-9">
						<SudGrid
							answer={answer}
							focusedCell={focusedCell}
							handleAnswer={handleAnswer}
							handleFocus={handleFocus}
							puzzle={puzzle}
							solved={solved}
						/>
					</Col>

					<Col>
						<SidePanel
							focusedCell={focusedCell}
							handleAnswer={handleAnswer}
							handleSolve={handleSolve}
						/>
					</Col>
				</Row>
			)}
		</Container>
	);
}
