import { Button, ButtonGroup, Container } from 'react-bootstrap';

export default function AnswerBar({ ...props }) {
	const n = +props.size || 9;

	return (
		<Container>
			<ButtonGroup className="mt-5" size="lg">
				{[...Array(n).keys()]
					.map(n => n + 1)
					.map(btnNum => {
						return (
							<Button
								className=" fs-1 p-3"
								key={btnNum}
								size="lg"
								val={btnNum}
								variant="outline-primary"
							>
								{btnNum}
							</Button>
						);
					})}
			</ButtonGroup>
		</Container>
	);
}
