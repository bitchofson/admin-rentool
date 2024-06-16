import { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from 'react-oidc-context';
import { BrowserRouter as Router } from 'react-router-dom';
import HomeIcon from '../assets/rentool-logo.svg'

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => {
    console.log('Toggle menu swagger clicked');
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const onUpdateActiveLink = value => {
    console.log('Update active link clicked');
    setActiveLink(value);
  };
  if (auth.isLoading) {
    return <></>;
  }

  let isloggedIn;
  if (auth.isAuthenticated) {
    window.history.replaceState({}, document.title, window.location.pathname);
    isloggedIn = auth.isAuthenticated;
  }

  return (
    <Router>
      <Navbar expand="md" className={scrolled ? 'scrolled' : ''}>
        <Container>
          <Navbar.Brand href="/">
            <img src={HomeIcon} alt="RenTool" className="navbar-icon" />
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isloggedIn && (
                <>
                  <Nav.Link
                    href="/tools"
                    className={activeLink === 'tools' ? 'active navbar-link' : 'navbar-link'}
                    onClick={() => onUpdateActiveLink('tools')}
                  >
                    Инструменты
                  </Nav.Link>
                  <Nav.Link
                    href="/rents"
                    className={activeLink === 'orders' ? 'active navbar-link' : 'navbar-link'}
                    onClick={() => onUpdateActiveLink('orders')}
                  >
                    Заказы
                  </Nav.Link>
                </>
              )}
            </Nav>

            <span className="navbar-text">
              {isloggedIn ? (
                <a target="_blank" rel="noopener noreferrer">
                  <button
                    className="vvd"
                    onClick={() =>
                      auth.signoutRedirect({
                        post_logout_redirect_uri: process.env.REACT_APP_PROJECT_URL,
                      })
                    }
                  >
                    <span>Выйти</span>
                  </button>
                </a>
              ) : (
                <a target="_blank" rel="noopener noreferrer">
                  <button className="vvd" onClick={() => auth.signinRedirect()}>
                    <span>Войти</span>
                  </button>
                </a>
              )}
            </span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Router>
  );
};
