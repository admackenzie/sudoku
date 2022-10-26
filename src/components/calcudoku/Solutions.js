// Components
import { Container, Row } from 'react-bootstrap';

export default function Solutions({ ...props }) {
	return (
		<Container className="border border-dark border-1 fs-4 py-3">
			{[...Array(props.solutions ? props.solutions.length : 0).keys()].map(
				n => {
					return (
						<Row className="justify-content-center" key={n}>
							{props.solutions[n]}
						</Row>
					);
				}
			)}
		</Container>
	);
}
