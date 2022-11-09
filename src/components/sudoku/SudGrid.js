// Components
import { Col, Container, Row } from 'react-bootstrap';

// Custom components
import SudCell from './SudCell';

export default function SudGrid({ ...props }) {
	return (
		// Grid style
		<Container
			className="border border-dark border-5"
			// style={{ maxWidth: '52rem' }}
		>
			{[0, 3, 6].map(gridRow => {
				return (
					<Row key={gridRow}>
						{[0, 3, 6].map(gridCol => {
							return (
								// Box style
								<Col className="border border-dark border-2" key={gridCol}>
									{[0, 1, 2].map(boxRow => {
										return (
											<Row key={boxRow}>
												{[0, 1, 2].map(boxCol => {
													const cellIdx =
														9 * (gridRow + boxRow) + gridCol + boxCol;

													return (
														<SudCell
															{...props}
															cellIdx={cellIdx}
															key={boxCol}
														/>
													);
												})}
											</Row>
										);
									})}
								</Col>
							);
						})}
					</Row>
				);
			})}
		</Container>
	);
}
