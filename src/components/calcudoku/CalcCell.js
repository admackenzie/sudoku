import { useState } from 'react';

import classes from '../sudoku/SudCell.module.css';

// Components
import { CloseButton, Col, Form, FormControl, Stack } from 'react-bootstrap';

export default function CalcCell({ ...props }) {
	const cageIdx = props.cages.findIndex(a => a.idx.includes(props.cellIdx));
	const cage = props.cages[cageIdx];
	const cellVal = props.answer[props.cellIdx];
	const re = new RegExp(`\\b[1-${props.size}]\\b`);

	const [cageState, setCageState] = useState(cageIdx);

	// Handle undo functionality
	const handleRemoveAnswer = () => props.handleAnswer('0', props.cellIdx);

	// Handle answer input
	const handleEnterAnswer = e => {
		if (re.test(e.target.value))
			props.handleAnswer(e.target.value, props.cellIdx);

		// Prevent all inputs but single digits from 1 to {puzzle size}
		e.target.value = null;
	};

	const handleClick = () => {
		props.handleFocus(props.cellIdx);
		props.handleSolutions(cageState);
	};

	return (
		<Col
			className="border border-dark border-2 p-1 "
			onClick={handleClick}
			// data-value={cageIdx}
			// onMouseEnter={() => props.onMouseEnter(cageState)}
			// onMouseLeave={() => props.onMouseEnter(null)}
			style={{ backgroundColor: cage.color }}
		>
			<Stack className="position-relative">
				{/* Cell header */}
				<div className="fs-5 position-absolute start-0 top-0">
					{props.cellIdx === cage.anchor
						? `${cage.value || ' '}${cage.op || ' '}`
						: String.fromCharCode(160)}
				</div>

				{!props.solved && re.test(cellVal) ? (
					// Display cell with answer and undo button
					<div>
						<CloseButton
							className={`${classes.undoButton} end-0 position-absolute top-0 `}
							onClick={handleRemoveAnswer}
						/>

						<Form.Control
							className={`${classes.input} fs-1 text-center`}
							defaultValue={cellVal}
							disabled
							id={`cell-${props.cellIdx}`}
							style={{
								backgroundColor: cage.color,
								border: `1px solid ${cage.color}`,
								boxShadow: `0 0 0 0.25rem ${cage.color}`,
							}}
						></Form.Control>
					</div>
				) : (
					// Display unanswered or solved cell
					<Form.Control
						className={`${classes.input} fs-1 text-center`}
						defaultValue={re.test(cellVal) ? cellVal : null}
						disabled={props.solved}
						id={`cell-${props.cellIdx}`}
						onClick={() => props.handleFocus(props.cellIdx)}
						onInput={e => handleEnterAnswer(e)}
						style={{
							backgroundColor: cage.color,
							border: `1px solid ${cage.color}`,
							boxShadow: `0 0 0 0.25rem ${cage.color}`,
						}}
					></Form.Control>
				)}
			</Stack>
		</Col>
	);
}
