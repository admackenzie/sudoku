import { Col, Container, Row, Table } from 'react-bootstrap';

export default function Grid({ ...props }) {
	const n = +props.size || 9;

	return (
		<Container className="border border-dark border-5 display-6 text-center">
			{[...Array(n).keys()].map(row => {
				return (
					<Row key={row}>
						{[...Array(n).keys()].map(col => {
							const idx = n * row + col;

							return (
								<Col className="border border-dark border-2 p-1" key={col}>
									{/[1-9]/.test(props.puzzle[idx]) ? props.puzzle[idx] : null}
								</Col>
							);
						})}
					</Row>
				);
			})}
		</Container>

		// <Table
		// 	className="border border-dark border-5 display-5 text-center m-0 p-0"
		// 	size="sm"
		// >
		// 	<tbody>
		// 		{[...Array(n).keys()].map(row => {
		// 			return (
		// 				<tr key={row}>
		// 					{[...Array(n).keys()].map(col => {
		// 						const idx = n * row + col;

		// 						return (
		// 							<td key={col}>
		// 								<input
		// 									className="border border-dark border-2 text-center m-0 p-0"
		// 									type="text"
		// 									disabled={props.puzzle[idx] > 0}
		// 									defaultValue={
		// 										props.puzzle[idx] > 0 ? props.puzzle[idx] : null
		// 									}
		// 									style={{ maxWidth: '4.5rem' }}
		// 								/>
		// 								{/* {idx} */}
		// 							</td>
		// 						);
		// 					})}
		// 				</tr>
		// 			);
		// 		})}
		// 	</tbody>
		// </Table>
	);
}
