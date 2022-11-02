import { useState } from 'react';

import {
	Button,
	ButtonToolbar,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
} from 'react-bootstrap';

export default function AnswerBar({ ...props }) {
	const n = +props.size || 9;
	const eliminated = props.eliminatedNumbers[props.focusedCell] || [];

	// const [eliminatedNumbers, setEliminatedNumbers] = useState([]);
	// const handleEliminateNumber = (btnNum, e) => {
	// 	const arr = [...eliminatedNumbers];

	// 	arr.includes(btnNum)
	// 		? arr.splice(arr.indexOf(btnNum), 1)
	// 		: arr.push(btnNum);

	// 	setEliminatedNumbers(arr);

	// 	e.preventDefault();
	// };

	// console.log(props.eliminatedNumbers[props.focusedCell]);
	return (
		<ButtonToolbar>
			<Stack direction="horizontal">
				<ToggleButtonGroup
					className="mt-5"
					onChange={props.handleEliminateNumber}
					size="lg"
					type="checkbox"
					value={eliminated}
				>
					{[...Array(9).keys()]
						.map(n => (n + 1).toString())
						.map(btnNum => {
							return (
								<ToggleButton
									className=" fs-1 p-3"
									disabled={btnNum > n}
									id={`btn-${btnNum}`}
									key={btnNum}
									onChange={e =>
										// Prevent submission of eliminated number
										!eliminated.includes(e.target.value) &&
										props.handleAnswer(e.target.value, props.focusedCell)
									}
									onContextMenu={e => props.handleEliminateNumber(btnNum, e)}
									value={btnNum}
									variant={btnNum > n ? 'secondary' : 'primary'}
								>
									{btnNum}
								</ToggleButton>
							);
						})}
				</ToggleButtonGroup>

				<Button
					className="ms-5 "
					onClick={props.handleSolve}
					size="lg"
					variant="primary"
				>
					Solve
				</Button>
			</Stack>
		</ButtonToolbar>
	);
}
