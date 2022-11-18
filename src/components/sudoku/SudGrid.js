// Components
import { Container, Row } from 'react-bootstrap';

// Custom components
import SudCell from './SudCell';

export default function SudGrid({ ...props }) {
	return (
		// Grid style
		<Container
			className="border border-dark border-5"
			// style={{ maxWidth: '52rem' }}
		>
			{[...Array(9).keys()].map(row => {
				return (
					<Row key={row}>
						{[...Array(9).keys()].map(col => {
							return <SudCell {...props} cellIdx={9 * row + col} key={col} />;
						})}
					</Row>
				);
			})}
		</Container>
	);
}
