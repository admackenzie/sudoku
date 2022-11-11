import { useEffect, useState } from 'react';

import classes from '../calcudoku.module.css';

// Components
import {
	ButtonToolbar,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
} from 'react-bootstrap';

export default function AnswerInset({ ...props }) {
	const n = +props.size || 9;

	const invalidRowIdx = props.invalid[`row${Math.floor(props.cellIdx / n)}`];
	const invalidColIdx = props.invalid[`col${props.cellIdx % n}`];

	const invalid = btnNum =>
		(invalidRowIdx && invalidRowIdx.includes(btnNum)) ||
		(invalidColIdx && invalidColIdx.includes(btnNum));

	// Calculate numbers for each row based on puzzle size
	const calcRow = row => {
		// First row: display three buttons for sizes 5, 6, and 9, else four buttons
		if (row === 1) {
			return [5, 6, 9].includes(n) ? [1, 2, 3] : [1, 2, 3, 4];
		}

		// Second row: display {size - first row} buttons for all sizes but 9
		else if (row === 2) {
			return [...Array(n - ([5, 6, 9].includes(n) ? 3 : 4)).keys()]
				.slice(0, n === 9 ? 3 : 4)
				.map(a => a + ([5, 6, 9].includes(n) ? 4 : 5));
		}

		// Third row: display three buttons for size 9 only
		else if (row === 3) {
			return [7, 8, 9];
		}
	};

	// Handle number elimination via right click
	const handleEliminateNumber = (btnNum, e) => {
		props.handleEliminateNumber(btnNum, props.cellIdx);

		// Prevent default context menu on right click
		e.preventDefault();
	};

	const handleEnterAnswer = btnNum => {
		// Prevent submitting eliminated numbers as an answer
		if (
			props.eliminated[props.cellIdx] &&
			props.eliminated[props.cellIdx].includes(+btnNum)
		)
			return false;

		props.handleAnswer(btnNum, props.cellIdx);
	};

	/* 
		FIXME: 
		- button active state CSS overrides disabled state (if button is eliminated before the same number in the row or col is selected, the color stays grayed out instead of invisible). May need to switch to active buttons by default, and right clicking to eliminate makes them inactive
	*/

	// Dynamically set custom CSS variable to cage color
	useEffect(
		() =>
			document.documentElement.style.setProperty(
				'--cageColor',
				`${props.color}`
			),
		[props.color]
	);

	return (
		<ButtonToolbar>
			<Stack>
				{(n === 9 ? [1, 2, 3] : [1, 2]).map(row => {
					return (
						<ToggleButtonGroup
							// Add margin for sizes 5 and 7 to center second row buttons
							className={row === 2 && [5, 7].includes(n) && 'mx-3'}
							key={row}
							// size="sm"
							type="checkbox"
							value={props.eliminated[props.cellIdx]}
						>
							{calcRow(row).map(btnNum => {
								return (
									<ToggleButton
										className={`${classes.numberButton}`}
										disabled={invalid(btnNum.toString())}
										id={`cell-${props.cellIdx}-${btnNum}`}
										key={btnNum}
										onChange={e => handleEnterAnswer(e.target.value)}
										onContextMenu={e => handleEliminateNumber(btnNum, e)}
										value={btnNum}
										variant="light"
									>
										{btnNum}
									</ToggleButton>
								);
							})}
						</ToggleButtonGroup>
					);
				})}
			</Stack>
		</ButtonToolbar>
	);
}
