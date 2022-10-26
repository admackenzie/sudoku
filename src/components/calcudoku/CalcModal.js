import { useState } from 'react';

// Components
import {
	Button,
	ButtonGroup,
	ButtonToolbar,
	CloseButton,
	Col,
	Container,
	Figure,
	Modal,
	Row,
	ToggleButton,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

// Images
import globeIcon from '../../images/globe-icon.png';

export default function CalcModal({ ...props }) {
	// TODO: display image of puzzle grid for each size

	// Modal visible state
	const [showModal, setShowModal] = useState(true);

	// Close modal and generate puzzle
	const handleClose = () => {
		setShowModal(false);
		props.generate();
	};

	return (
		<Modal
			backdrop="static"
			// centered
			// fullscreen={useState(true)}
			keyboard={false}
			show={showModal}
			size="lg"
		>
			<Modal.Header>
				<Modal.Title className="mx-auto">Calcudoku options</Modal.Title>

				{/* Close button */}
				<LinkContainer to="/">
					<CloseButton />
				</LinkContainer>
			</Modal.Header>

			<Modal.Body>
				<Container>
					<Row>
						<h2>About</h2>
						<p>
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt
							ratione consectetur, sit quis, aliquid libero illo ducimus esse
							debitis omnis laboriosam praesentium, nesciunt sunt veniam. Quos
							minima cumque temporibus nihil aperiam reiciendis rerum pariatur
							mollitia voluptatibus, quae voluptas deserunt sint inventore eum,
							enim, non sit cupiditate delectus dicta ipsum quidem incidunt iure
							nostrum optio. Nulla in minima quo omnis vel minus voluptatem
							reprehenderit. Ducimus inventore consectetur dignissimos hic
							officia impedit, harum quia beatae nesciunt delectus distinctio
							atque maiores porro, excepturi cumque, dolores accusamus aliquid
							sint veniam provident. Amet quia similique, voluptas sequi tenetur
							fugiat ea iure animi enim facilis tempore?
						</p>
					</Row>

					<Row>
						{/* Example image */}
						<Col className="align-items-center d-flex justify-content-center">
							<Figure>
								<Figure.Image
									alt="puzzle grid"
									className="d-block mx-auto"
									height={100}
									src={globeIcon}
									width={100}
								/>

								<Figure.Caption className="text-center">
									{props.size} by {props.size} puzzle
								</Figure.Caption>
							</Figure>
						</Col>

						{/* Size selection */}
						<Col>
							<h2>Size:</h2>

							<ButtonToolbar className="d-flex flex-column">
								{[
									['4', '5'],
									['6', '7'],
									['8', '9'],
								].map(arr => {
									return (
										<ButtonGroup key={arr} size="lg">
											{arr.map(radio => (
												<ToggleButton
													checked={props.size === radio}
													id={`radio-${radio}`}
													key={radio}
													onChange={e => props.setSize(e.target.value)}
													type="radio"
													value={radio}
													variant={'outline-primary'}
												>
													{`${radio} x ${radio}`}
												</ToggleButton>
											))}
										</ButtonGroup>
									);
								})}
							</ButtonToolbar>
						</Col>
					</Row>
				</Container>
			</Modal.Body>

			<Modal.Footer>
				{/* Back button */}
				<LinkContainer to="/">
					<Button variant="secondary">Back</Button>
				</LinkContainer>

				{/* Generate button */}
				<Button onClick={handleClose} variant="primary">
					Generate puzzle
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
