import { useEffect, useState } from 'react';

// Styles
import classes from '../../sudoku.module.css';

// Components
import { CloseButton, Col, Form } from 'react-bootstrap';

export default function SudCell({ ...props }) {
	const cellVal = props.answer[props.cellIdx];
	const re = /\b[1-9]\b/;

	// Isolate cells along box edges that need additional border styles
	const boxBottom = cellIdx =>
		Math.floor(cellIdx / 9) === 2 || Math.floor(cellIdx / 9) === 5;
	const boxRight = cellIdx => cellIdx % 9 === 2 || cellIdx % 9 === 5;

	// Prevent interactivity for given number cells
	const given = useState(re.test(props.puzzle[props.cellIdx]))[0];

	// Handle answer input
	const handleEnterAnswer = e => {
		if (re.test(e.target.value))
			props.handleAnswer(e.target.value, props.cellIdx);

		// Prevent all inputs but single digits from 1 to 9
		e.target.value = null;
	};

	// Handle undo functionality
	const handleRemoveAnswer = () => {
		props.handleAnswer('0', props.cellIdx);
		// setHover(false);
	};

	// FIXME: Is there lag from loading the whole node list on each click?
	// Highlight first empty cell on first page render and keep cells highlighted on click away
	// Must add sudCell class to all inputs
	// useEffect(() => {
	// 	document
	// 		.querySelectorAll('.sudCell')
	// 		.forEach(node => node.classList.remove(classes.focused));

	// 	document
	// 		.getElementById(`cell-${props.focusedCell}`)
	// 		.classList.add(classes.focused);
	// }, [props.focusedCell]);

	return (
		<Col
			className={
				// Apply additional border styles to 3 x 3 boxes
				`${classes.cell}
				${boxBottom(props.cellIdx) && classes.boxBottom}
				${boxRight(props.cellIdx) && classes.boxRight} 
			
				p-1`
			}
			onClick={() => props.handleFocus(props.cellIdx)}
		>
			{
				// Test if a valid answer has been provided for cell
				!given && !props.solved && re.test(cellVal) ? (
					// Display cell with answer and undo button
					<div className="position-relative">
						<CloseButton
							className={`${classes.undoButton} end-0 position-absolute top-0 `}
							onClick={handleRemoveAnswer}
						/>

						<Form.Control
							className={`${classes.cellContent} fs-1 text-center`}
							defaultValue={cellVal}
							disabled
							id={`cell-${props.cellIdx}`}
						></Form.Control>
					</div>
				) : (
					// Display all other cells
					<Form.Control
						className={`${classes.cellContent} fs-1 text-center`}
						defaultValue={re.test(cellVal) ? cellVal : null}
						disabled={given || props.solved}
						id={`cell-${props.cellIdx}`}
						onClick={() => props.handleFocus(props.cellIdx)}
						// onFocus={() => props.handleFocus(props.cellIdx)}
						onInput={e => handleEnterAnswer(e)}
						// tabIndex={given || props.solved ? -1 : 0}
					></Form.Control>
				)
			}
		</Col>
	);
}
