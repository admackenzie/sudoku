// Components
import { Container, Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

// TODO: use eventKey and activeKey with state (in Layout?) to properly highlight active links in navbar. Currently clicking out from the modal windows leaves them incorrectly highlighted

export default function Header() {
	return (
		<Navbar bg="light" expand="sm">
			<Container>
				{/* Home button */}
				<LinkContainer to="/">
					<Navbar.Brand>Home</Navbar.Brand>
				</LinkContainer>

				{/* Hamburger button */}
				<Navbar.Toggle />

				{/* Page links */}
				<Navbar.Collapse>
					<Nav className="me-auto">
						<LinkContainer to="/sudoku">
							<Nav.Link className="active">Sudoku</Nav.Link>
						</LinkContainer>

						<LinkContainer to="/calcudoku">
							<Nav.Link className="active">Calcudoku</Nav.Link>
						</LinkContainer>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);

	// return (
	// 	<nav className="navbar navbar-expand-sm bg-light">
	// 		<div className="container-fluid">
	// 			{/* Home link */}
	// 			<Link className="navbar-brand" to="/">
	// 				[LOGO]
	// 			</Link>
	// 			{/* Hamburger button toggler */}
	// 			<button
	// 				className="navbar-toggler"
	// 				data-bs-toggle="collapse"
	// 				data-bs-target="#navbar"
	// 				type="button"
	// 			>
	// 				<span className="navbar-toggler-icon"></span>
	// 			</button>
	// 			{/* Links */}
	// 			<div
	// 				className="collapse navbar-collapse"
	// 				// ID for hamburger button functionality
	// 				id="navbar"
	// 			>
	// 				<ul className="navbar-nav">
	// 					{['Sudoku', 'Calcudoku'].map(a => {
	// 						return (
	// 							<li className="nav-item" key={a}>
	// 								<Link className="active nav-link" to={`/${a.toLowerCase()}`}>
	// 									{a}
	// 								</Link>
	// 							</li>
	// 						);
	// 					})}
	// 				</ul>
	// 			</div>
	// 		</div>
	// 	</nav>
	// );
}
