// Components
import { Col, Container, Row } from 'react-bootstrap';

export default function SudGrid({ ...props }) {
	return (
		// Grid style
		<Container className="border border-dark border-5 fs-1 text-center">
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
													const idx = 9 * (gridRow + boxRow) + gridCol + boxCol;

													return (
														// Cell style
														<Col
															className="border border-dark border-2 p-1"
															key={boxCol}
														>
															{/[1-9]/.test(props.puzzle[idx])
																? props.puzzle[idx]
																: String.fromCharCode(160)}
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
