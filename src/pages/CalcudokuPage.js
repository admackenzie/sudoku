import { useState } from 'react';

// Components
import { Button, Col, Container, Row } from 'react-bootstrap';

// Custom components
import CalcGrid from '../components/calcudoku/CalcGrid';
import CalcModal from '../components/calcudoku/CalcModal';
import Solutions from '../components/calcudoku/Solutions';
import AnswerBar from '../components/AnswerBar';
import AnswerGrid from '../components/AnswerGrid';
import AnswerGridEnhanced from '../components/AnswerGridEnhanced';

// Logic
import { generate } from '../modules/calcudoku.js';

export default function CalcudokuPage() {
	const [size, setSize] = useState('4');
	const [puzzle, setPuzzle] = useState();
	const [solutions, setSolutions] = useState();
	const [answer, setAnswer] = useState();

	// Set the puzzle state to an object with the puzzle string and its cages array
	const handleGeneration = () => {
		setPuzzle(generate(+size));
		setAnswer(Array(Math.pow(size, 2)).fill('0'));
	};

	// Display solutions element on clicking a cage
	const handleSolutions = cageIdx => {
		const solutionArr = Number.isInteger(cageIdx)
			? puzzle.cages[cageIdx].solutions
			: [];

		setSolutions(solutionArr.length > 0 ? solutionArr : null);
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

	// Solve state
	const [solved, setSolved] = useState(false);
	const handleSolve = () => {
		setSolved(true);
		setAnswer(puzzle.puzzleStr.split(''));

		if (answer && answer.join('') === puzzle.puzzleStr) handleSolve();
	};

	// Remember state of eliminated answer numbers for each cell
	const [eliminatedNumbers, setEliminatedNumbers] = useState({});
	const handleEliminateNumber = (btnNum, e) => {
		// Create empty array for new cells
		const arr = eliminatedNumbers[focusedCell]
			? eliminatedNumbers[focusedCell]
			: [];

		// Toggle eliminated status by adding or removing button number
		arr.includes(btnNum)
			? arr.splice(arr.indexOf(btnNum), 1)
			: arr.push(btnNum);

		const temp = { ...eliminatedNumbers };
		temp[focusedCell] = arr;

		setEliminatedNumbers(temp);

		e.preventDefault();
	};

	return (
		<Container>
			<CalcModal generate={handleGeneration} size={size} setSize={setSize} />

			<Row>
				{/* Display grid only after puzzle is generated */}
				<Col className="col-9">
					{puzzle && (
						<CalcGrid
							answer={answer}
							cages={puzzle.cages}
							focusedCell={focusedCell}
							handleAnswer={handleAnswer}
							handleFocus={handleFocus}
							handleSolutions={handleSolutions}
							puzzle={puzzle.puzzleStr}
							size={size}
							solved={solved}
						/>
					)}

					<AnswerBar
						eliminatedNumbers={eliminatedNumbers}
						focusedCell={focusedCell}
						handleAnswer={handleAnswer}
						handleEliminateNumber={handleEliminateNumber}
						handleSolve={handleSolve}
						size={size}
					/>
				</Col>

				{/* Display solutions on hover */}
				<Col>{solutions && <Solutions solutions={solutions} />}</Col>
			</Row>

			{/* <AnswerGrid size={size} /> */}
			{/* <AnswerGridEnhanced size={size} /> */}
		</Container>
	);
}
