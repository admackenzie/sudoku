import { Button, ButtonGroup, ButtonToolbar, Container } from 'react-bootstrap';

export default function ButtonGrid({ ...props }) {
	const n = +props.size || 9;

	return (
		<Container className="mt-5" style={{ maxWidth: '200px' }}>
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
										key={col}
										value={btnNum}
										variant="outline-primary"
									>
										{btnNum}
									</Button>
								);
							})}
						</ButtonGroup>
					);
				})}
			</ButtonToolbar>
		</Container>
	);
}
