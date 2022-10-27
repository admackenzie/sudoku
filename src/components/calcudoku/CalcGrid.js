// Components
import { Col, Container, Row } from 'react-bootstrap';

// Custom components
import CellContent from '../CellContent';

export default function CalcGrid({ ...props }) {
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

							return (
								// FIXME: All the children of this element must have the data-value attribute or the solutions element may not render/disappears when mousing over certain parts of the cage. Is there a way to force attribute inheritance? Use state instead?
								<Col
									className="border border-dark border-2 p-1"
									data-value={cageIdx}
									key={col}
									onMouseEnter={e => props.onMouseEnter(e.target.dataset.value)}
									style={{ backgroundColor: props.cages[cageIdx].color }}
								>
									<CellContent
										answer={props.answer}
										cage={props.cages[cageIdx]}
										cellIdx={cellIdx}
										data-value={cageIdx}
										handleAnswer={props.handleAnswer}
										puzzle={props.puzzle}
										size={props.size}
									/>
								</Col>
							);
						})}
					</Row>
				);
			})}
		</Container>
	);
}
