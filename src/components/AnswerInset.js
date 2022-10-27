// Components
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';

export default function AnswerInset({ ...props }) {
	const n = +props.size || 9;

	// Calculate appropriate numbers for each row based on puzzle size
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

	// Bubble up the clicked button's value and change the display
	const handleClick = e => {
		props.handleAnswer(e.target.value, props.cellIdx);
		props.handleAnswerEl();
	};

	return (
		<ButtonToolbar className="d-flex flex-column">
			{(n === 9 ? [1, 2, 3] : [1, 2]).map(row => {
				return (
					<ButtonGroup
						// Add margin for sizes 5 and 7 to center second row buttons
						className={row === 2 && [5, 7].includes(n) && 'mx-3'}
						key={row}
						size="sm"
					>
						{calcRow(row).map(btnNum => {
							return (
								<Button
									key={btnNum}
									onClick={handleClick}
									value={btnNum}
									variant="outline-dark"
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
