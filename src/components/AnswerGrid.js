import { Button, ButtonGroup, ButtonToolbar, Stack } from 'react-bootstrap';

export default function AnswerGrid({ ...props }) {
	const n = +props.size || 9;

	return (
		<ButtonToolbar>
			<Stack>
				{[0, 1, 2].map(row => {
					return (
						<ButtonGroup key={row} size="lg">
							{[0, 1, 2].map(col => {
								const btnNum = 3 * row + col + 1;

								return (
									<Button
										className="fs-1 p-3"
										disabled={btnNum > n}
										onClick={e =>
											props.handleAnswer(e.target.value, props.focusedCell)
										}
										key={col}
										value={btnNum}
										variant={
											btnNum > n ? 'outline-secondary' : 'outline-primary'
										}
									>
										{btnNum}
									</Button>
								);
							})}
						</ButtonGroup>
					);
				})}

				<Button
					className="mt-5"
					onClick={props.handleSolve}
					size="lg"
					variant="primary"
				>
					Solve
				</Button>

				{/* <ButtonGroup size="sm">
				<Button variant="primary">Up</Button>
				<Button variant="primary">Down</Button>
				<Button variant="primary">Left</Button>
				<Button variant="primary">Right</Button>
			</ButtonGroup> */}
			</Stack>
		</ButtonToolbar>
	);
}
