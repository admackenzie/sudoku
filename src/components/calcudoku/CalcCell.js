import { useEffect, useState } from 'react';

// Styles
import classes from '../../calcudoku.module.css';

// Components
import { CloseButton, Col, Form, Stack } from 'react-bootstrap';

// Custom components
import AnswerInset from '../AnswerInset';

// Images
import lockedIcon from '../../images/locked-icon.png';
import unlockedIcon from '../../images/unlocked-icon.png';

export default function CalcCell({ ...props }) {
	const cageIdx = props.cages.findIndex(cage =>
		cage.idx.includes(props.cellIdx)
	);
	const { anchor, color, lockable, op, value } = props.cages[cageIdx];
	const cellVal = props.answer[props.cellIdx];
	const re = new RegExp(`\\b[1-${props.size}]\\b`);
	const answered = re.test(cellVal);

	// Local state to display/hide lock icons based on lock state
	const [lockedCage, setLockedCage] = useState(null);
	const handleLock = cageIdx => {
		props.handleLockSolution();

		setLockedCage(Number.isInteger(lockedCage) ? null : cageIdx);
	};

	/*  
		TODO:
		- Lock icons only appear when hovering a cage
		- Lock icons appear in anchor cell when hovering any cell in the cage
	*/

	return (
		<Col
			className={`${classes.cell} border border-dark border-2 p-1 `}
			// Load appropriate cage solutions on mouse movement. Disabled when a cage is locked
			onMouseEnter={() => !props.locked && props.handleSolutions(cageIdx)}
			onMouseLeave={() => !props.locked && props.handleSolutions(null)}
			// FIXME: get this to work with useEffect instead of hard-coded style
			style={{ backgroundColor: color }}
		>
			<Stack>
				{/* Cell header */}
				<div className="align-items-center d-flex justify-content-between">
					{/* Display operation in anchor cells, otherwise a blank header*/}
					<div className="fs-5">
						{props.cellIdx === anchor
							? `${value || ''}${op || ''}`
							: String.fromCharCode(160)}
					</div>

					{/* Display undo button for answered cells or the lock icon in lockable anchor cells */}
					{props.cellIdx === anchor && lockable && (
						<img
							alt={`${props.locked ? 'locked' : 'unlocked'} icon`}
							// Hide all lock icons but the clicked one when a cage is locked
							className={`${
								props.locked && cageIdx !== lockedCage
									? classes.hidden
									: classes.lockIcon
							}`}
							onClick={() => handleLock(cageIdx)}
							src={props.locked ? lockedIcon : unlockedIcon}
						/>
					)}
				</div>

				{/* Cell body */}
				<div className="position-relative">
					<Form.Control
						className={`${classes.cell} fs-1 text-center`}
						defaultValue={answered ? cellVal : ''}
						disabled
					></Form.Control>

					{answered ? (
						<div className="bottom-0 end-0 position-absolute">
							<CloseButton
								className={`${classes.undoButton}`}
								// Undo functionality: revert the answer array at the current cell's index to '0'
								onClick={() => props.handleAnswer('0', props.cellIdx)}
							/>
						</div>
					) : (
						<div className="bottom-0 position-absolute w-100">
							<AnswerInset {...props} color={{ color }} />
						</div>
					)}
				</div>
			</Stack>
		</Col>
	);
}
