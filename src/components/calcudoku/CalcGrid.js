// Components
import { Container, Row } from 'react-bootstrap';

// Custom components
import CalcCell from './CalcCell';

export default function CalcGrid({ ...props }) {
	return (
		<Container
			className="border border-dark border-5 text-center"
			// FIXME: better way to do this?
			style={{ maxWidth: `${+props.size * 8}rem` }}
		>
			{[...Array(+props.size).keys()].map(row => {
				return (
					<Row key={row}>
						{[...Array(+props.size).keys()].map(col => {
							return (
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
