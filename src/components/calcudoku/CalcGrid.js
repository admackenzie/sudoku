import { useState } from 'react';

// Components
import { CloseButton, Col, Container, Row } from 'react-bootstrap';

export default function CalcGrid({ ...props }) {
	const [answered, setAnswered] = useState(false);

	return (
		<Container className="border border-dark border-5 text-center">
			{[...Array(+props.size).keys()].map(row => {
				return (
					<Row key={row}>
						{[...Array(+props.size).keys()].map(col => {
							const cellIdx = props.size * row + col;
							const cageIdx = props.cages.findIndex(a =>
								a.idx.includes(cellIdx)
							);
							const cage = props.cages[cageIdx];

							return (
								// FIXME: All the children of this element must have the data-value attribute or the solutions element may not render/disappears when mousing over certain parts of the cage. Is there a way to force attribute inheritance? Use state instead?
								<Col
									className="border border-dark border-2 p-1"
									data-value={cageIdx}
									key={col}
									onMouseEnter={e => props.onMouseEnter(e.target.dataset.value)}
									style={{ backgroundColor: cage.color }}
								>
									<span
										className="d-flex justify-content-between"
										data-value={cageIdx}
									>
										{/* Operation */}
										<span className="fs-5">
											{cellIdx === cage.anchor
												? `${cage.value || ' '}${cage.op || ' '}`
												: String.fromCharCode(160)}
										</span>

										{/* Close button only visible when answer has been entered*/}
										{answered && <CloseButton data-value={cageIdx} />}
									</span>

									<span className="fs-2">
										{/* {String.fromCharCode(160)} */}
										{props.puzzle[cellIdx]}
									</span>
								</Col>
							);
						})}
					</Row>
				);
			})}
		</Container>
	);
}
