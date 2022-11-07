import classes from '../../calcudoku.module.css';

// Components
import { CloseButton, Col, Form, Stack } from 'react-bootstrap';

import AnswerInset from '../AnswerInset';

export default function CalcCell({ ...props }) {
	const cageIdx = props.cages.findIndex(cage =>
		cage.idx.includes(props.cellIdx)
	);
	const { anchor, color, op, value } = props.cages[cageIdx];
	const cellVal = props.answer[props.cellIdx];
	const re = new RegExp(`\\b[1-${props.size}]\\b`);

	// Handle undo functionality
	const handleRemoveAnswer = () => props.handleAnswer('0', props.cellIdx);

	return (
		<Col
			className="border border-dark border-2 p-1 "
			onMouseEnter={() => props.handleSolutions(cageIdx)}
			onMouseLeave={() => props.handleSolutions(null)}
			style={{ backgroundColor: color }}
		>
			<Stack className="position-relative">
				{/* Cell header */}
				<div className="fs-5 position-absolute start-0 top-0">
					{anchor === props.cellIdx && `${value || ''}${op || ''}`}
				</div>

				{!props.solved && re.test(cellVal) ? (
					// Display cell with answer and undo button
					<div>
						<CloseButton
							className={`${classes.undoButton} end-0 position-absolute top-0 `}
							onClick={handleRemoveAnswer}
						/>

						<Form.Control
							className={`${classes.cell} fs-1 text-center`}
							defaultValue={cellVal}
							disabled
							// id={`cell-${props.cellIdx}`}
						></Form.Control>
					</div>
				) : (
					// FIXME: fix the CSS so this div appears below the cell header without resorting to margin-top
					<div className="mt-4">
						<AnswerInset {...props} color={{ color }} />
					</div>
				)}
			</Stack>
		</Col>
	);
}
