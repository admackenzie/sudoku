import { useState } from 'react';

// Components
import CloseButton from 'react-bootstrap/CloseButton';

// Custom components
import AnswerInset from './AnswerInset';

export default function CellContent({ ...props }) {
	const cellVal = props.answer[props.cellIdx];

	// Handle visibility of close button and answer buttons
	const [answered, setAnswered] = useState(/[1-9]/.test(cellVal));
	const handleAnswerEl = () => setAnswered(!answered);

	// Handle undo functionality
	const handleRemoveAnswer = () => {
		props.handleAnswer('0', props.cellIdx);
		handleAnswerEl();
	};

	// if (props.solved) {
	// 	setAnswered(true);

	// 	return (
	// 		<div className="align-items-center bg-light d-flex h-100 justify-content-center">
	// 			<div className="fs-1 h-100">{props.puzzle[props.cellIdx]}</div>
	// 		</div>
	// 	);
	// }

	return props.sudoku && /[1-9]/.test(props.puzzle[props.cellIdx]) ? (
		// Prevent answer buttons rendering for given numbers in sudoku puzzles
		<div className="align-items-center bg-light d-flex h-100 justify-content-center">
			<div className="fs-1 h-100">{cellVal}</div>
		</div>
	) : (
		// Render all other cells with answer and undo buttons
		<div className="d-flex flex-column h-100">
			{/* Cell header */}
			<div className="d-flex justify-content-between">
				{/* Operation */}
				<div className="fs-5">
					{!props.sudoku
						? props.cellIdx === props.cage.anchor
							? `${props.cage.value || ' '}${props.cage.op || ' '}`
							: String.fromCharCode(160)
						: null}
				</div>

				{/* Undo button only visible when answer has been entered*/}
				{answered && <CloseButton onClick={handleRemoveAnswer} />}
			</div>

			{/* Cell value */}
			<div className=" align-items-center d-flex fs-1 h-100 justify-content-center">
				{/[1-9]/.test(cellVal) && cellVal}
			</div>

			{/* Answer buttons only visible when answer has not been entered*/}
			{!answered && (
				<AnswerInset
					cellIdx={props.cellIdx}
					handleAnswer={props.handleAnswer}
					handleAnswerEl={handleAnswerEl}
					size={props.size}
				/>
			)}
		</div>
	);
}
