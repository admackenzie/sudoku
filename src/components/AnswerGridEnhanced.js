import { Button, Col, Container, Row } from 'react-bootstrap';

import AnswerGrid from './AnswerGrid';

export default function AnswerGridEnhanced({ ...props }) {
	return (
		<Container
			className="border border-dark border-1 mt-5"
			style={{ maxWidth: '400px' }}
		>
			<Row>
				<Col className="border border-warning border-1">TL</Col>
				<Col className="d-grid">
					<Button className="py-3" size="lg" variant="primary"></Button>
				</Col>
				<Col className="border border-warning border-1">TR</Col>
			</Row>

			<Row className="align-items-center ">
				<Col className="d-flex justify-content-end">
					<Button className="py-5" size="lg" variant="primary"></Button>
				</Col>
				<Col>
					<AnswerGrid size={props.size} />
				</Col>
				<Col className="d-flex justify-content-start">
					<Button className="py-5" size="lg" variant="primary"></Button>
				</Col>
			</Row>

			<Row>
				<Col className="border border-warning border-1">BL</Col>
				<Col className="d-grid">
					<Button className="py-3" size="lg" variant="primary"></Button>
				</Col>
				<Col className="border border-warning border-1">BR</Col>
			</Row>
		</Container>
	);
}
