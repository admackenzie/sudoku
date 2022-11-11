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
	// ----------------------------------------------------------------
	//                          PUZZLE GENERATION
	// ----------------------------------------------------------------

	const [size, setSize] = useState('4');
	const [puzzle, setPuzzle] = useState();

	// Set the puzzle state to an object with the puzzle string and its cages array
	const handleGeneration = () => {
		setPuzzle(generate(+size));
		setAnswer(Array(Math.pow(size, 2)).fill('0'));
	};

	// ----------------------------------------------------------------
	//                          SOLUTIONS PANEL
	// ----------------------------------------------------------------

	// Handle locking/unlocking solution display to one cage
	const [locked, setLocked] = useState(false);
	const [lockedSolution, setLockedSolution] = useState(null);
	const handleLockSolution = cageIdx => {
		setLocked(!locked);

		setLockedSolution(
			Number.isInteger(cageIdx) ? puzzle.cages[cageIdx].solutions : null
		);
	};

	// Display solutions element by hovering over a cage
	const [solutionsData, setSolutionsData] = useState();
	const handleSolutions = (cageIdx, cellIdx) =>
		setSolutionsData({
			cageIdx: cageIdx,
			cellIdx: cellIdx,
			invalidSolutions: invalidSolutions,
			lockedSolution: lockedSolution,
			solutions: Number.isInteger(cageIdx)
				? puzzle.cages[cageIdx].solutions
				: [],
			straight: puzzle.cages[cageIdx] && puzzle.cages[cageIdx].straight,
		});

	const [invalidSolutions, setInvalidSolutions] = useState({});
	const handleInvalidSolutions = (btnNum, cellIdx) => {
		const rowIdx = Math.floor(cellIdx / size);
		const colIdx = cellIdx % size;

		const row = invalidSolutions[`row${rowIdx}`]
			? invalidSolutions[`row${rowIdx}`]
			: [];

		const col = invalidSolutions[`col${colIdx}`]
			? invalidSolutions[`col${colIdx}`]
			: [];

		const temp = { ...invalidSolutions };

		row.includes(btnNum)
			? row.splice(row.indexOf(btnNum), 1)
			: row.push(btnNum);

		col.includes(btnNum)
			? col.splice(col.indexOf(btnNum), 1)
			: col.push(btnNum);

		temp[`row${rowIdx}`] = row;
		temp[`col${colIdx}`] = col;

		setInvalidSolutions(temp);
	};

	// ----------------------------------------------------------------
	// 						USER SUBMITTED ANSWERS
	// ----------------------------------------------------------------

	// Modify answer array
	const [answer, setAnswer] = useState();
	const handleAnswer = (btnNum, cellIdx) => {
		// Handle number buttons display

		btnNum === '0'
			? handleButtons(answer[cellIdx], cellIdx)
			: handleButtons(btnNum, cellIdx);

		// Handle solutions color display
		btnNum === '0'
			? handleInvalidSolutions(answer[cellIdx], cellIdx)
			: handleInvalidSolutions(btnNum, cellIdx);

		const temp = [...answer];
		temp.splice(cellIdx, 1, btnNum);

		setAnswer(temp);
	};

	// Maintain object of invalid answers for each row and column
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

	// Handle number elimination via right click
	const [eliminatedNumbers, setEliminatedNumbers] = useState({});
	const handleEliminateNumber = (btnNum, cellIdx) => {
		const arr = eliminatedNumbers[cellIdx] ? eliminatedNumbers[cellIdx] : [];

		const temp = { ...eliminatedNumbers };

		// Toggle eliminated state by adding or removing button number
		arr.includes(btnNum)
			? arr.splice(arr.indexOf(btnNum), 1)
			: arr.push(btnNum);

		temp[cellIdx] = arr;

		setEliminatedNumbers(temp);
	};

	// ----------------------------------------------------------------
	// 						MISC. / TODO
	// ----------------------------------------------------------------

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
							eliminated={eliminatedNumbers}
							invalid={invalidButtons}
							locked={locked}
							puzzle={puzzle.puzzleStr}
							size={size}
							solved={solved}
							// Handlers
							handleAnswer={handleAnswer}
							handleEliminateNumber={handleEliminateNumber}
							handleLockSolution={handleLockSolution}
							handleSolutions={handleSolutions}
						/>
					)}
				</Col>

				{/* Display solutions on hover */}
				<Col>
					{solutionsData && (
						<Solutions solutionsData={solutionsData} size={size} />
					)}
				</Col>
			</Row>
		</Container>
	);
}
