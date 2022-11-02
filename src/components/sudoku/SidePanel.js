import { Button, Col, Container, Row, Stack } from 'react-bootstrap';

import AnswerGrid from '../AnswerGrid';

export default function SidePanel({ ...props }) {
	return (
		<Container className="border border-dark border-1 h-100 ">
			<Stack>
				<AnswerGrid {...props} />
			</Stack>
		</Container>
	);
}
