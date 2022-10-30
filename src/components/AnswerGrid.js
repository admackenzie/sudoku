import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';

export default function AnswerGrid({ ...props }) {
	const n = +props.size || 9;

	return (
		<ButtonToolbar className="d-flex flex-column">
			{[0, 1, 2].map(row => {
				return (
					<ButtonGroup key={row} size="lg">
						{[0, 1, 2].map(col => {
							const btnNum = 3 * row + col + 1;

							return (
								<Button
									className="fs-1 p-3"
									disabled={btnNum > n}
									onClick={e => props.handleButtonAnswer(e.target.value)}
									key={col}
									value={btnNum}
									variant={btnNum > n ? 'outline-secondary' : 'outline-primary'}
								>
									{btnNum}
								</Button>
							);
						})}
					</ButtonGroup>
				);
			})}
		</ButtonToolbar>
	);
}
