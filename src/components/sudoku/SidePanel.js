import { Col, Container, Row } from 'react-bootstrap';

import AnswerGrid from '../AnswerGrid';

export default function SidePanel({ ...props }) {
	return (
		<Container className="border border-dark border-1">
			<AnswerGrid {...props} />
		</Container>
	);
}
