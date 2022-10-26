import { useState } from 'react';

// Components
import {
	Button,
	ButtonGroup,
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

export default function SudModal({ ...props }) {
	// TODO: display image of sudoku grid for each difficulty state with showing how many givens to expect

	// Difficulty selection buttons
	const radios = [
		{ givens: [35, 40], name: 'Easy', value: '0' },
		{ givens: [30, 35], name: 'Intermediate', value: '1' },
		{ givens: [25, 30], name: 'Hard', value: '2' },
		{ givens: [20, 25], name: 'Expert', value: '3' },
	];

	// Modal visible state
	const [showModal, setShowModal] = useState(true);
	const [givens, setGivens] = useState(radios[props.difficulty].givens);

	// Close modal and generate puzzle
	const handleClose = () => {
		setShowModal(false);
		props.generate();
	};

	// Adjust difficulty state and display image based on selection
	const handleSelection = e => {
		props.setDifficulty(e);
		setGivens(radios[e].givens);
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
				<Modal.Title className="mx-auto">Sudoku options</Modal.Title>

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
									{givens[0]} to {givens[1]} given numbers
								</Figure.Caption>
							</Figure>
						</Col>

						{/* Difficulty selection */}
						<Col>
							<h2>Difficulty:</h2>

							<ButtonGroup size="lg">
								{radios.map(radio => (
									<ToggleButton
										checked={props.difficulty === radio.value}
										id={`radio-${radio.value}`}
										key={radio.value}
										onChange={e => handleSelection(e.target.value)}
										type="radio"
										value={radio.value}
										variant={'outline-primary'}
									>
										{radio.name}
									</ToggleButton>
								))}
							</ButtonGroup>
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
