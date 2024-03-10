import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './AuthContext';
import Login from './Login';
import Logout from './Logout';
import Home from './Home';
import Repositories from './Repositories';
import FollowRepo from './FollowRepo';
import { useEffect, useState } from 'react';



function RealApp() {
  const { user, login } = useAuth();
  useEffect(() => {
    chrome.storage.sync.get('user', function (result) {
      if (result.user) {
        login(result.user);
      }
    });
  }, []);
  const pageNr = {
    "Fork Insight": 0,
    "Repositories": 1,
    "Follow_Repo": 2,
    "Fork_Clustering": 3,
  };
  const [curr_page, setCurrPage] = useState(0);
  function changePage(source) {
    console.log(source.target.id);
    setCurrPage(pageNr[source.target.id]);
  }
  return (
    <Container fluid style={{ padding: 0 }}>
      <Navbar expand="sm" bg="primary" data-bs-theme="dark" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand onClick={changePage} id='Fork Insight' style={{ cursor: 'pointer' }}>Fork Insight</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
            <Nav>
              <Nav.Link onClick={changePage} id='Repositories'>Repositories</Nav.Link>
              <Nav.Link onClick={changePage} id='Follow_Repo'>Import Current</Nav.Link>
              <NavDropdown title="More Functions" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Fork Clustering</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.2">Fork Comparison</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.3">Conflict Detection</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link> {!user ? <Login /> : <Logout />}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid style={{ padding: 0 }}>
        {curr_page === 0 ? <Home /> : null}
        {curr_page === 1 ? <Repositories /> : null}
        {curr_page === 2 ? <FollowRepo /> : null}
      </Container>
    </Container>
  );
}

export default RealApp;
