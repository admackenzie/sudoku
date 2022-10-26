// Components
import Container from 'react-bootstrap/Container';

// Custom components
import Footer from './Footer';
import Header from './Header';

export default function Layout(props) {
	return (
		<div>
			<header>
				<Header />
			</header>

			<Container>
				<main>{props.children}</main>
			</Container>

			<footer>
				<Footer />
			</footer>
		</div>
	);
}
