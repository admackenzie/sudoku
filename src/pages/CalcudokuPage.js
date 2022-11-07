import { useState } from 'react';

// Components
import { Button, Col, Container, Row } from 'react-bootstrap';

// Custom components
import CalcGrid from '../components/calcudoku/CalcGrid';
import CalcModal from '../components/calcudoku/CalcModal';
import Solutions from '../components/calcudoku/Solutions';
import AnswerInset from '../components/AnswerInset';
import AnswerBar from '../components/AnswerBar';
import AnswerGrid from '../components/AnswerGrid';
import AnswerGridEnhanced from '../components/AnswerGridEnhanced';

// Logic
import { generate } from '../modules/calcudoku.js';

export default function CalcudokuPage() {
	const [size, setSize] = useState('4');
	const [puzzle, setPuzzle] = useState();

	// Set the puzzle state to an object with the puzzle string and its cages array
	const handleGeneration = () => {
		setPuzzle(generate(+size));
		setAnswer(Array(Math.pow(size, 2)).fill('0'));
	};

	// Display solutions element on clicking a cage
	const [solutions, setSolutions] = useState();
	const handleSolutions = cageIdx => {
		const solutionArr = Number.isInteger(cageIdx)
			? puzzle.cages[cageIdx].solutions
			: [];

		setSolutions(solutionArr.length > 0 ? solutionArr : null);
	};

	// Modify answer array
	const [answer, setAnswer] = useState();
	const handleAnswer = (btnNum, cellIdx) => {
		// Handle number buttons display
		btnNum === '0'
			? handleButtons(answer[cellIdx], cellIdx)
			: handleButtons(btnNum, cellIdx);

		const temp = [...answer];
		temp.splice(cellIdx, 1, btnNum);

		setAnswer(temp);
	};

	const [invalidButtons, setInvalidButtons] = useState({});
	const handleButtons = (btnNum, cellIdx) => {
		const rowIdx = Math.floor(cellIdx / size);
		const colIdx = cellIdx % size;

		const row = invalidButtons[`row${rowIdx}`]
			? invalidButtons[`row${rowIdx}`]
			: [];

		const col = invalidButtons[`col${colIdx}`]
			? invalidButtons[`col${colIdx}`]
			: [];

		const temp = { ...invalidButtons };

		row.includes(btnNum)
			? row.splice(row.indexOf(btnNum), 1)
			: row.push(btnNum);

		col.includes(btnNum)
			? col.splice(col.indexOf(btnNum), 1)
			: col.push(btnNum);

		temp[`row${rowIdx}`] = row;
		temp[`col${colIdx}`] = col;

		setInvalidButtons(temp);
	};

	// TODO: implement solve button
	// Solve state
	const [solved, setSolved] = useState(false);
	const handleSolve = () => {
		setSolved(true);
		setAnswer(puzzle.puzzleStr.split(''));

		if (answer && answer.join('') === puzzle.puzzleStr) handleSolve();
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
							// focusedCell={focusedCell}
							handleAnswer={handleAnswer}
							// handleFocus={handleFocus}
							handleSolutions={handleSolutions}
							invalid={invalidButtons}
							puzzle={puzzle.puzzleStr}
							size={size}
							solved={solved}
						/>
					)}
				</Col>

				{/* Display solutions on hover */}
				<Col>{solutions && <Solutions solutions={solutions} />}</Col>
			</Row>

			{/* <AnswerGrid size={size} /> */}
			{/* <AnswerGridEnhanced size={size} /> */}
		</Container>
	);
}
