// Custom components
import Footer from './Footer';
import Header from './Header';

export default function Layout(props) {
	return (
		<div>
			<header>
				<Header />
			</header>

			<main>{props.children}</main>

			<footer>
				<Footer />
			</footer>
		</div>
	);
}
