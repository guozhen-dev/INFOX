import logo from './logo.svg';
import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Logout from './Logout';
import Home from './Home';
import Repositories from './Repositories';
import { useState } from 'react';


function RealApp() {
  const { user } = useAuth();
  const pageNr = {
    "Fork Insight": 0,
    "Repositories": 1,
    "Fork_Clustering": 2,
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
          <Navbar.Brand onClick={changePage} id='Fork Insight'>Fork Insight</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
            <Nav>
              <Nav.Link onClick={changePage} id='Repositories'>Repositories</Nav.Link>
              <Nav.Link href="#link">Import Current</Nav.Link>
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
        {curr_page == 0 ? <Home /> : null}
        {curr_page == 1 ? <Repositories /> : null}
      </Container>
    </Container>
  );
}

export default RealApp;
