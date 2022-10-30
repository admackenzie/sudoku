import { useState } from 'react';

// Components
import Col from 'react-bootstrap/Col';

// Custom components
import AnswerInset from '../AnswerInset';
import CalcCellHeader from './CalcCellHeader';

export default function CalcCell({ ...props }) {
	const cageIdx = props.cages.findIndex(a => a.idx.includes(props.cellIdx));
	const cellVal = props.answer[props.cellIdx];
	const re = /\b[1-9]\b/;

	// Handle visibility of close button and answer buttons
	const [answered, setAnswered] = useState(re.test(cellVal));
	const handleAnswerEl = () => setAnswered(!answered);

	// Handle undo functionality
	const handleRemoveAnswer = () => {
		props.handleAnswer('0', props.cellIdx);
		handleAnswerEl();
	};

	// Handle highlight
	// const [highlightTEST, setHighlightTEST] = useState(false);
	// const handleClick = () => setHighlightTEST(!highlightTEST);

	return (
		<Col
			className={`border border-2 p-1 border-dark`}
			data-value={cageIdx}
			// onClick={handleClick}
			onMouseEnter={e => props.onMouseEnter(e.target.dataset.value)}
			style={{ backgroundColor: props.cages[cageIdx].color }}
		>
			{/* Cell Content */}
			<div className="d-flex flex-column h-100">
				<CalcCellHeader
					{...props}
					answered={answered}
					cage={props.cages[cageIdx]}
					handleRemoveAnswer={handleRemoveAnswer}
				/>

				{/* Cell value */}
				<div className=" align-items-center d-flex fs-1 h-100 justify-content-center">
					{re.test(cellVal) && cellVal}
				</div>

				{/* Answer buttons only visible when answer has not been entered*/}
				{!answered && (
					<AnswerInset
						{...props}
						// data-value={cageIdx}
						// cellIdx={props.cellIdx}
						// handleAnswer={props.handleAnswer}
						handleAnswerEl={handleAnswerEl}
						// size={props.size}
					/>
				)}
			</div>
		</Col>
	);
}
