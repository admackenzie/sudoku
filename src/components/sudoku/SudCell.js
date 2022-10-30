import { useState } from 'react';

// Styles
import classes from './SudCell.module.css';

// Components
import { CloseButton, Col, Form } from 'react-bootstrap';

// TODO: implement side panel and link buttons to cell index

export default function CalcCell({ ...props }) {
	const cellVal = props.answer[props.cellIdx];
	const re = /\b[1-9]\b/;

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
		setHover(false);
	};

	// Undo button styling
	const [hover, setHover] = useState(false);
	const handleButtonAppearance = () => setHover(!hover);

	return (
		<Col className="border border-dark border-2 p-1">
			{
				// Test if a valid answer has been provided for cell
				!given && !props.solved && re.test(cellVal) ? (
					// Display cell with answer and undo button
					<div className="position-relative">
						<CloseButton
							className="position-absolute top-0 end-0"
							onClick={handleRemoveAnswer}
							onMouseEnter={handleButtonAppearance}
							onMouseLeave={handleButtonAppearance}
							style={{
								fontSize: `${hover ? '100%' : '95%'}`,
								opacity: `${hover ? '1' : '0.1'}`,
								transition: '0.1s ease-in',
							}}
						/>

						<Form.Control
							className="fs-1 text-center"
							defaultValue={cellVal}
							readOnly
						></Form.Control>
					</div>
				) : (
					// Display all other cells
					<Form.Control
						className="fs-1 text-center"
						defaultValue={re.test(cellVal) ? cellVal : null}
						disabled={given || props.solved}
						onFocus={() => props.handleFocus(props.cellIdx)}
						onInput={e => handleEnterAnswer(e)}
					></Form.Control>
				)
			}
		</Col>
	);
}
