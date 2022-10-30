// Components
import { Container, Row } from 'react-bootstrap';

// Custom components
import CalcCell from './CalcCell';

export default function CalcGrid({ ...props }) {
	return (
		<Container className="border border-dark border-5 text-center">
			{[...Array(+props.size).keys()].map(row => {
				return (
					<Row key={row}>
						{[...Array(+props.size).keys()].map(col => {
							return (
								// FIXME: All the children of this element must have the data-value attribute or the solutions element may not render/disappears when mousing over certain parts of the cage. Is there a way to force attribute inheritance? Use state instead?
								<CalcCell
									{...props}
									cellIdx={props.size * row + col}
									key={col}
								></CalcCell>
							);
						})}
					</Row>
				);
			})}
		</Container>
	);
}
