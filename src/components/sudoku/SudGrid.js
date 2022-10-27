// Components
import { Col, Container, Row } from 'react-bootstrap';

// Custom components
import CellContent from '../CellContent';

export default function SudGrid({ ...props }) {
	return (
		// Grid style
		<Container className="border border-dark border-5">
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
														// Cell style
														<Col
															className="border border-dark border-2 p-1"
															key={boxCol}
														>
															<CellContent
																answer={props.answer}
																cellIdx={cellIdx}
																handleAnswer={props.handleAnswer}
																puzzle={props.puzzle}
																sudoku
															/>
														</Col>
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
