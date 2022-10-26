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
}
