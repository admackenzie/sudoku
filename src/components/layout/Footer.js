import { useState } from 'react';

// Components
import { Container, Image, Nav, Navbar } from 'react-bootstrap';

// Images
import emailIcon from '../../images/email-icon.png';
import githubLogo from '../../images/github-logo.png';
import globeIcon from '../../images/globe-icon.png';

// TODO: Modal window for email/contact info
// TODO: Improve appearance of collapsed menu
// TODO: Acknowledgements link (modal for large?)

export default function Footer() {
	// Footer expanded/collapsed state
	const [expanded, setExpanded] = useState(true);

	const links = [
		{
			alt: 'globe icon',
			src: globeIcon,
			text: 'Website',
			url: 'http://admac.dev',
		},
		{
			alt: 'Github logo',
			src: githubLogo,
			text: 'GitHub',
			url: 'https://github.com/admackenzie',
		},
		{ alt: 'email icon', src: emailIcon, text: 'Email' },
	];

	return (
		<Navbar
			bg="light"
			expand="sm"
			fixed="bottom"
			onToggle={() => setExpanded(!expanded)}
		>
			<Container>
				<Navbar.Brand>{`© ${new Date().getFullYear()} Adrian MacKenzie`}</Navbar.Brand>

				{/* Hamburger button */}
				<Navbar.Toggle />

				{/* Page links */}
				<Navbar.Collapse className="justify-content-end">
					<Nav>
						{links.map(link => {
							return expanded ? (
								// Expanded appearance
								<Nav.Link
									href={link.url || '#'}
									key={link.alt}
									rel={link.url && 'noreferrer'}
									target={link.url && '_blank'}
								>
									<Image
										alt={link.alt}
										src={link.src}
										style={{ height: '1.5rem' }}
									/>
								</Nav.Link>
							) : (
								// Collapsed appearance
								<Nav.Link
									className="d-flex flex-row"
									href={link.url || '#'}
									key={link.alt}
									rel={link.url && 'noreferrer'}
									target={link.url && '_blank'}
								>
									<Image
										alt={link.alt}
										className="pe-1"
										src={link.src}
										style={{ height: '1.5rem' }}
									/>
									<p>{link.text}</p>
								</Nav.Link>
							);
						})}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);

	// const links = [
	// 	{ alt: 'globe icon', src: globeIcon, url: 'http://admac.dev' },
	// 	{
	// 		alt: 'Github logo',
	// 		src: githubLogo,
	// 		url: 'https://github.com/admackenzie',
	// 	},
	// 	{ alt: 'email icon', src: emailIcon },
	// ];
	// return (
	// 	<nav className={'border-light border-top border-1 navbar navbar-expand'}>
	// 		<div className={'container-fluid'}>
	// 			<span className={'navbar-brand'}>
	// 				{`© ${new Date().getFullYear()} Adrian MacKenzie`}
	// 			</span>
	// 			{/* Hamburger button toggler */}
	// 			{/* <button
	// 				className={`navbar-toggler`}
	// 				data-bs-toggle="collapse"
	// 				data-bs-target="#navbar"
	// 				type="button"
	// 			>
	// 				<span className={`navbar-toggler-icon`}></span>
	// 			</button> */}
	// 			{/* Media links */}
	// 			<ul className={'d-flex justify-content-end navbar-nav'}>
	// 				{/* TODO: Modal attributions link */}
	// 				{/* TODO: modal popup for contact info */}
	// 				{links.map(a => {
	// 					return (
	// 						<li className={'nav-item'} key={a.alt}>
	// 							<a
	// 								className={'nav-link active'}
	// 								href={a.url && a.url}
	// 								rel={a.url && 'noreferrer'}
	// 								target={a.url && '_blank'}
	// 							>
	// 								<img
	// 									alt={a.alt}
	// 									src={a.src}
	// 									style={{ height: '1.5rem' }}
	// 								></img>
	// 							</a>
	// 						</li>
	// 					);
	// 				})}
	// 			</ul>
	// 		</div>
	// 	</nav>
	// );
}
